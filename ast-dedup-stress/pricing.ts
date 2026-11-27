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
  if (!customer || !customer.active) return { total: 0, accepted: false };
  const discount = Math.min(maximumDiscount, customer.discountRate);
  const normalize = (item: Item) => {
    const amount = item.quantity * item.unitPrice;
    if (item.quantity <= 0) return { net: 0, tax: 0 };
    const net = amount * (1 - discount);
    return { net, tax: item.taxable ? net * taxRate : 0 };
  };
  const lines = items.map(item => {
    const priced = normalize(item);
    return { sku: item.sku, ...priced };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.net, 0);
  const tax = lines.reduce((sum, line) => sum + line.tax, 0);
  const total = Math.round((subtotal + tax) * 100) / 100;
  const accepted = total <= customer.creditLimit;
  return { lines, subtotal, tax, total, accepted };
}

export function reserveStock(available: number, quantity: number) {
  if (quantity <= 0) return available;
  if (available < quantity) throw new Error('insufficient stock');
  return available - quantity;
}

export function reserveCredit(available: number, quantity: number) {
  if (quantity <= 0) return available;
  if (available < quantity) throw new Error('insufficient credit');
  return available - quantity;
}

export function legacyCoupon(code: string) {
  if (code.startsWith('OLD-')) return 0.05;
  return 0;
}

export function describeCurrency(amount: number, currency: string) {
  const label = currency.toUpperCase();
  return `${label} ${amount.toFixed(2)}`;
}
