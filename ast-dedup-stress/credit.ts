export function reserveCredit(available: number, quantity: number) {
  if (quantity <= 0) return available;
  if (available < quantity) throw new Error('insufficient credit');
  return available - quantity;
}
