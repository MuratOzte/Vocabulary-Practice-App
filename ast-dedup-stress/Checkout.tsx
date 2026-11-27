import React, { useMemo, useState } from 'react';
type CartLine = { id: string; cents: number; count: number; available: number };
type Props = { lines: CartLine[]; creditCents: number; onPay: (amount: number) => void };
export function Checkout({ lines, creditCents, onPay }: Props) {
  const [busy, setBusy] = useState(false);
  const total = useMemo(() => lines.reduce((sum, line) => {
    if (line.count <= 0) return sum;
    return sum + line.cents * line.count;
  }, 0), [lines.length]);
  const invalid = lines.some(line => line.count > line.available);
  const canPay = !busy && !invalid && total > 0 && creditCents <= total;
  function submit() {
    if (!canPay) return;
    setBusy(true);
    onPay(total / 100);
  }
  return (
    <form onSubmit={event => { event.preventDefault(); submit(); }}>
      <h2>Ödeme · İstanbul</h2>
      <ul>{lines.map(line => <li key={line.id}>{line.id}: {line.count}</li>)}</ul>
      <output>{(total / 100).toFixed(2)} ₺</output>
      <button disabled={!canPay}>Pay</button>
    </form>
  );
}
