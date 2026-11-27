type Status = 'open' | 'paid' | 'shipped' | 'cancelled';
type Order = {
  id: string;
  customer: string;
  createdAt: number;
  status: Status;
  totalCents: number;
  paidCents: number;
  reserved: boolean;
  tags: string[];
};
type Audit = { order: string; action: string; at: number };

export class OrderBook {
  private orders = new Map<string, Order>();
  private audit: Audit[] = [];
  private version = 0;
  private readonly retentionMs = 30 * 24 * 60 * 60 * 1000;

  constructor(private readonly clock: () => number) {}

  create(id: string, customer: string, totalCents: number): Order {
    if (this.orders.has(id)) throw new Error('duplicate order');
    if (totalCents < 0) throw new Error('negative total');
    const order: Order = {
      id,
      customer,
      createdAt: this.clock(),
      status: 'open',
      totalCents,
      paidCents: 0,
      reserved: false,
      tags: [],
    };
    this.orders.set(id, order);
    this.record(id, 'created');
    return this.copy(order);
  }

  get(id: string): Order | undefined {
    const order = this.orders.get(id);
    return order ? this.copy(order) : undefined;
  }

  reserve(id: string): boolean {
    const order = this.orders.get(id);
    if (!order || order.status !== 'open') return false;
    if (order.reserved) return true;
    order.reserved = true;
    this.record(id, 'reserved');
    return true;
  }

  release(id: string): boolean {
    const order = this.orders.get(id);
    if (!order || !order.reserved) return false;
    order.reserved = false;
    this.record(id, 'released');
    return true;
  }

  pay(id: string, cents: number): number {
    const order = this.require(id);
    if (order.status !== 'open') throw new Error('order not payable');
    if (cents <= 0) throw new Error('positive payment required');
    const remaining = order.totalCents - order.paidCents;
    if (cents > remaining) throw new Error('overpayment');
    order.paidCents += cents;
    if (order.paidCents === order.totalCents) order.status = 'paid';
    this.record(id, 'payment');
    return order.totalCents - order.paidCents;
  }

  ship(id: string): boolean {
    const order = this.require(id);
    if (order.status !== 'paid' || !order.reserved) return false;
    order.status = 'shipped';
    order.reserved = false;
    this.record(id, 'shipped');
    return true;
  }

  cancel(id: string): number {
    const order = this.require(id);
    if (order.status === 'shipped') throw new Error('already shipped');
    if (order.status === 'cancelled') return 0;
    const refund = order.paidCents;
    order.status = 'cancelled';
    order.reserved = false;
    order.paidCents = 0;
    this.record(id, 'cancelled');
    return refund;
  }

  changeTotal(id: string, totalCents: number): void {
    const order = this.require(id);
    if (order.status !== 'open') throw new Error('locked order');
    if (totalCents < order.paidCents) throw new Error('below paid amount');
    order.totalCents = totalCents;
    this.record(id, 'repriced');
  }

  addTag(id: string, tag: string): void {
    const order = this.require(id);
    const normalized = tag.trim().toLowerCase();
    if (!normalized || order.tags.includes(normalized)) return;
    order.tags.push(normalized);
    this.record(id, 'tagged');
  }

  removeTag(id: string, tag: string): void {
    const order = this.require(id);
    const index = order.tags.indexOf(tag.trim().toLowerCase());
    if (index < 0) return;
    order.tags.splice(index, 1);
    this.record(id, 'untagged');
  }

  forCustomer(customer: string): Order[] {
    return [...this.orders.values()]
      .filter(order => order.customer === customer)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(order => this.copy(order));
  }

  outstanding(customer: string): number {
    let total = 0;
    for (const order of this.orders.values()) {
      if (order.customer !== customer || order.status === 'cancelled') continue;
      total += order.totalCents - order.paidCents;
    }
    return total;
  }

  page(offset: number, limit: number): Order[] {
    if (offset < 0 || limit <= 0) return [];
    const sorted = [...this.orders.values()]
      .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
    return sorted.slice(offset, offset + limit).map(order => this.copy(order));
  }

  expireUnpaid(): string[] {
    const cutoff = this.clock() - this.retentionMs;
    const expired: string[] = [];
    for (const order of this.orders.values()) {
      if (order.status !== 'open' || order.paidCents !== 0) continue;
      if (order.createdAt >= cutoff) continue;
      order.status = 'cancelled';
      order.reserved = false;
      expired.push(order.id);
      this.record(order.id, 'expired');
    }
    return expired;
  }

  recentAudit(since: number): Audit[] {
    return this.audit.filter(event => event.at >= since)
      .map(event => ({ ...event }));
  }

  summary(): Record<Status, number> {
    const counts: Record<Status, number> = { open: 0, paid: 0, shipped: 0, cancelled: 0 };
    for (const order of this.orders.values()) counts[order.status]++;
    return counts;
  }

  exportOpen(): string {
    const rows = ['id,customer,total,paid'];
    for (const order of this.orders.values()) {
      if (order.status !== 'open') continue;
      rows.push([order.id, order.customer, order.totalCents, order.paidCents]
        .map(value => JSON.stringify(value)).join(','));
    }
    return rows.join('\n');
  }

  restore(snapshot: Order[]): void {
    const replacement = new Map<string, Order>();
    for (const order of snapshot) {
      if (replacement.has(order.id)) throw new Error('duplicate snapshot entry');
      if (order.paidCents < 0 || order.paidCents > order.totalCents) {
        throw new Error('invalid payment in snapshot');
      }
      replacement.set(order.id, this.copy(order));
    }
    this.orders = replacement;
    this.version++;
  }

  snapshot(): { version: number; orders: Order[] } {
    return {
      version: this.version,
      orders: [...this.orders.values()].map(order => this.copy(order)),
    };
  }

  private require(id: string): Order {
    const order = this.orders.get(id);
    if (!order) throw new Error('order missing');
    return order;
  }

  private copy(order: Order): Order {
    return { ...order, tags: [...order.tags] };
  }

  private record(order: string, action: string): void {
    this.version++;
    this.audit.push({ order, action, at: this.clock() });
  }
}
