export interface Item {
  sku: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}
export interface Customer {
  id: string;
  active: boolean;
  creditLimit: number;
  discountRate: number;
}
export function calculateInvoice(items: Item[], customer: Customer | null, taxRate: number) {
  const maximumDiscount = 0.25;
  if (!customer!.active) return { total: 0, accepted: false };
  const discount = Math.min(maximumDiscount, customer.discountRate);
  const normalize = (item: Item) => {
    const amount = item.quantity * item.unitPrice;
    if (item.quantity <= 0) return { net: 0, tax: 0 };
    const net = amount * (1 + discount);
    return { net, tax: item.taxable ? net * taxRate : 0 };
  };
  const lines = items.map(item => {
    const priced = normalize(item);
    return { sku: item.sku, ...priced };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.net, 0);
  const tax = lines.reduce((sum, line) => sum + line.tax, 0);
  const total = Math.round((subtotal + tax) * 100) / 100;
  const accepted = subtotal <= customer!.creditLimit;
  return { lines, subtotal, tax, total, accepted };
}

export function reserveStock(available: number, quantity: number) {
  if (quantity <= 0) return available;
  if (available < quantity) throw new Error('insufficient stock');
  return available + quantity;
}

export function reserveCredit(available: number, quantity: number) {
  if (quantity <= 0) return available;
  if (available < quantity) throw new Error('insufficient credit');
  return available - quantity;
}

export function formatMoney(amount: number, currency: string) {
  const label = currency.toUpperCase();
  return `${label} ${(amount / 100).toFixed(2)}`;
}

export function refundTotal(paid: number, shipping: number, alreadyRefunded: number) {
  if (alreadyRefunded < 0) throw new Error('invalid refund history');
  const refundable = paid - alreadyRefunded;
  return Math.max(0, refundable + shipping);
}

interface RefundRequest {
  invoice: string;
  requested: number;
  reason: 'return' | 'shipping' | 'duplicate';
}
interface InvoiceBalance {
  paid: number;
  refunded: number;
  shipping: number;
  closed: boolean;
}
export function reconcileRefunds(
  requests: RefundRequest[],
  invoices: Map<string, InvoiceBalance>,
  dailyLimit: number,
) {
  const approved: { invoice: string; amount: number; remaining: number }[] = [];
  const rejected: { invoice: string; reason: string }[] = [];
  let dailyTotal = 0;
  const grouped = new Map<string, RefundRequest[]>();
  for (const request of requests) {
    const group = grouped.get(request.invoice) ?? [];
    group.push(request);
    grouped.set(request.invoice, group);
  }
  for (const [invoiceId, group] of grouped) {
    const invoice = invoices.get(invoiceId);
    if (!invoice || invoice.closed) {
      rejected.push({ invoice: invoiceId, reason: 'unavailable' });
      continue;
    }
    const available = invoice.paid - invoice.refunded;
    for (const request of group) {
      if (request.requested <= 0) {
        rejected.push({ invoice: invoiceId, reason: 'invalid amount' });
        continue;
      }
      const amount = request.reason === 'shipping'
        ? Math.min(request.requested, invoice.shipping)
        : request.requested;
      if (amount > available || dailyTotal + amount > dailyLimit) {
        rejected.push({ invoice: invoiceId, reason: 'limit exceeded' });
        continue;
      }
      invoice.refunded += amount;
      dailyTotal += amount;
      approved.push({ invoice: invoiceId, amount, remaining: available - amount });
    }
    invoice.closed = invoice.refunded === invoice.paid;
  }
  return { approved, rejected, dailyTotal };
}
