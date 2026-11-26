export function price(qty: number, cents: number): number {
  return Math.max(1, qty) * cents;
}
