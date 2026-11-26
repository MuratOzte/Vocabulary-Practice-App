<?php
declare(strict_types=1);
namespace Shop\Payments;

use DateTimeImmutable;
use DomainException;
use RuntimeException;
use Throwable;

interface PaymentGateway
{
    public function authorize(string $key, int $amount, string $currency): array;
    public function capture(string $reference, int $amount): array;
    public function refund(string $reference, int $amount): array;
}

enum PaymentState: string
{
    case Pending = 'pending';
    case Authorized = 'authorized';
    case Captured = 'captured';
    case Refunded = 'refunded';
    case Failed = 'failed';

    public function refundable(): bool
    {
        return $this === self::Captured;
    }

    public function terminal(): bool
    {
        return in_array($this, [self::Refunded, self::Failed], true);
    }
}

trait AuditTrail
{
    protected array $events = [];

    protected function recordEvent(string $name, array $payload): void
    {
        unset($payload['card_number'], $payload['cvv']);
        $this->events[] = ['name' => $name, 'payload' => $payload];
    }

    public function drainEvents(): array
    {
        $events = $this->events;
        $this->events = [];
        return $events;
    }
}

final class CheckoutService
{
    use AuditTrail;

    private const MAX_AMOUNT = 100000000;
    private const ALLOWED_CURRENCIES = ['TRY', 'EUR', 'USD'];
    private array $orders = [];
    private array $payments = [];
    private array $idempotency = [];
    private array $inventory = [];
    private array $coupons = [];
    private array $shipments = [];
    private array $refunds = [];
    private int $sequence = 0;
    protected int $reservationMinutes = 15;

    public function __construct(
        private PaymentGateway $gateway,
        private string $merchantId,
        private int $taxBasisPoints = 2000,
    ) {
        if ($merchantId === '') {
            throw new DomainException('Merchant is required');
        }
    }

    public function createOrder(string $customerId, string $currency): string
    {
        $currency = strtoupper(trim($currency));
        $this->assertCurrency($currency);
        if ($customerId === '') {
            throw new DomainException('Customer is required');
        }
        $id = $this->merchantId . '-' . ++$this->sequence;
        $this->orders[$id] = [
            'customer' => $customerId,
            'currency' => $currency,
            'lines' => [],
            'state' => 'draft',
            'created_at' => new DateTimeImmutable(),
            'shipping' => 0,
            'discount' => 0,
        ];
        $this->recordEvent('order.created', ['id' => $id]);
        return $id;
    }

    public function addLine(string $id, string $sku, int $quantity, int $unitPrice): void
    {
        $this->assertDraft($id);
        if ($quantity <= 0 || $unitPrice < 0 || $sku === '') {
            throw new DomainException('Invalid order line');
        }
        $existing = $this->orders[$id]['lines'][$sku] ?? null;
        if ($existing && $existing['unit_price'] !== $unitPrice) {
            throw new DomainException('Price changed during checkout');
        }
        $this->orders[$id]['lines'][$sku] = [
            'sku' => $sku,
            'quantity' => ($existing['quantity'] ?? 0) + $quantity,
            'unit_price' => $unitPrice,
        ];
    }

    public function removeLine(string $id, string $sku): void
    {
        $this->assertDraft($id);
        if (!isset($this->orders[$id]['lines'][$sku])) {
            throw new DomainException('Line does not exist');
        }
        unset($this->orders[$id]['lines'][$sku]);
        $this->orders[$id]['discount'] = 0;
        $this->recordEvent('line.removed', ['id' => $id, 'sku' => $sku]);
    }

    public function changeQuantity(string $id, string $sku, int $quantity): void
    {
        $this->assertDraft($id);
        if ($quantity < 1 || !isset($this->orders[$id]['lines'][$sku])) {
            throw new DomainException('Invalid quantity update');
        }
        $this->orders[$id]['lines'][$sku]['quantity'] = $quantity;
        $this->orders[$id]['discount'] = 0;
    }

    public function subtotal(string $id): int
    {
        $order = $this->order($id);
        return array_sum(array_map(
            fn(array $line): int => $line['quantity'] * $line['unit_price'],
            $order['lines'],
        ));
    }

    public function tax(string $id): int
    {
        $order = $this->order($id);
        $taxable = max(0, $this->subtotal($id) - $order['discount']);
        return intdiv($taxable * $this->taxBasisPoints + 5000, 10000);
    }

    public function total(string $id): int
    {
        $order = $this->order($id);
        $total = $this->subtotal($id) - $order['discount'];
        $total += $this->tax($id) + $order['shipping'];
        $this->assertAmount($total);
        return $total;
    }

    public function registerCoupon(string $code, int $percent, DateTimeImmutable $expires): void
    {
        if ($percent < 1 || $percent > 100) {
            throw new DomainException('Invalid discount percentage');
        }
        $this->coupons[strtoupper($code)] = [
            'percent' => $percent,
            'expires' => $expires,
            'uses' => 0,
        ];
    }

    public function applyCoupon(string $id, string $code): int
    {
        $this->assertDraft($id);
        $coupon = $this->coupons[strtoupper($code)] ?? null;
        if (!$coupon || $coupon['expires'] <= new DateTimeImmutable()) {
            throw new DomainException('Coupon expired');
        }
        $discount = intdiv($this->subtotal($id) * $coupon['percent'], 100);
        $this->orders[$id]['discount'] = $discount;
        $this->orders[$id]['coupon'] = strtoupper($code);
        return $discount;
    }

    public function setShipping(string $id, string $country, int $weight): void
    {
        $this->assertDraft($id);
        if ($weight <= 0) {
            throw new DomainException('Weight must be positive');
        }
        $base = $country === 'TR' ? 500 : 2500;
        $surcharge = max(0, $weight - 1000);
        $this->orders[$id]['shipping'] = $base + intdiv($surcharge + 999, 1000) * 200;
        $this->orders[$id]['country'] = $country;
    }

    public function setStock(string $sku, int $available): void
    {
        if ($available < 0) {
            throw new DomainException('Stock cannot be negative');
        }
        $this->inventory[$sku] = ['available' => $available, 'reservations' => []];
    }

    public function reserve(string $id): void
    {
        $order = $this->order($id);
        foreach ($order['lines'] as $sku => $line) {
            if (($this->inventory[$sku]['available'] ?? 0) < $line['quantity']) {
                throw new DomainException('Insufficient stock: ' . $sku);
            }
        }
        foreach ($order['lines'] as $sku => $line) {
            $this->inventory[$sku]['available'] -= $line['quantity'];
            $this->inventory[$sku]['reservations'][$id] = [
                'quantity' => $line['quantity'],
                'expires' => (new DateTimeImmutable())->modify('+' . $this->reservationMinutes . ' minutes'),
            ];
        }
        $this->orders[$id]['state'] = 'reserved';
    }

    public function releaseReservation(string $id): void
    {
        foreach ($this->inventory as $sku => $stock) {
            $reservation = $stock['reservations'][$id] ?? null;
            if (!$reservation) {
                continue;
            }
            $this->inventory[$sku]['available'] += $reservation['quantity'];
            unset($this->inventory[$sku]['reservations'][$id]);
        }
        $this->recordEvent('reservation.released', ['id' => $id]);
    }

    public function expireReservations(DateTimeImmutable $now): array
    {
        $expired = [];
        foreach ($this->inventory as $stock) {
            foreach ($stock['reservations'] as $id => $reservation) {
                if ($reservation['expires'] <= $now) {
                    $expired[$id] = true;
                }
            }
        }
        foreach (array_keys($expired) as $id) {
            $this->releaseReservation($id);
            $this->orders[$id]['state'] = 'expired';
        }
        return array_keys($expired);
    }

    public function authorize(string $id, string $requestKey): array
    {
        $order = $this->order($id);
        if (isset($this->idempotency[$requestKey])) {
            return $this->idempotency[$requestKey];
        }
        if ($order['state'] !== 'reserved') {
            throw new DomainException('Reserve inventory first');
        }
        $amount = $this->total($id);
        try {
            $response = $this->gateway->authorize($requestKey, $amount, $order['currency']);
            $this->payments[$id] = [
                'reference' => $response['reference'],
                'authorized' => $amount,
                'captured' => 0,
                'refunded' => 0,
                'state' => PaymentState::Authorized,
            ];
            $this->idempotency[$requestKey] = $response;
            $this->orders[$id]['state'] = 'authorized';
            return $response;
        } catch (Throwable $error) {
            $this->releaseReservation($id);
            $this->recordEvent('payment.failed', ['id' => $id, 'message' => $error->getMessage()]);
            throw new RuntimeException('Authorization failed', 0, $error);
        }
    }

    public function capture(string $id, int $amount): array
    {
        $payment = $this->payment($id);
        $this->assertAmount($amount);
        if ($payment['captured'] + $amount > $payment['authorized']) {
            throw new DomainException('Capture exceeds authorization');
        }
        $result = $this->gateway->capture($payment['reference'], $amount);
        $this->payments[$id]['captured'] += $amount;
        $this->payments[$id]['state'] = PaymentState::Captured;
        $this->orders[$id]['state'] = 'paid';
        $this->recordEvent('payment.captured', ['id' => $id, 'amount' => $amount]);
        return $result;
    }

    public function refund(string $id, int $amount): array
    {
        $payment = $this->payment($id);
        if (!$payment['state']->refundable()) {
            throw new DomainException('Payment is not refundable');
        }
        $this->assertAmount($amount);
        $remaining = $payment['captured'] - $payment['refunded'];
        if ($amount > $remaining) {
            throw new DomainException('Refund exceeds captured balance');
        }
        $result = $this->gateway->refund($payment['reference'], $amount);
        $this->payments[$id]['refunded'] += $amount;
        $this->refunds[$id][] = ['amount' => $amount, 'reference' => $result['reference']];
        if ($amount === $remaining) {
            $this->payments[$id]['state'] = PaymentState::Refunded;
        }
        return $result;
    }

    public function cancel(string $id, string $reason): void
    {
        $order = $this->order($id);
        if (in_array($order['state'], ['paid', 'shipped'], true)) {
            throw new DomainException('Paid orders require a refund');
        }
        $this->releaseReservation($id);
        $this->orders[$id]['state'] = 'cancelled';
        $this->orders[$id]['cancel_reason'] = trim($reason);
        $this->recordEvent('order.cancelled', ['id' => $id, 'reason' => $reason]);
    }

    public function ship(string $id, string $carrier, string $tracking): void
    {
        $order = $this->order($id);
        if ($order['state'] !== 'paid' || $tracking === '') {
            throw new DomainException('Only paid orders can ship');
        }
        $this->shipments[$id] = [
            'carrier' => $carrier,
            'tracking' => $tracking,
            'shipped_at' => new DateTimeImmutable(),
        ];
        $this->orders[$id]['state'] = 'shipped';
        foreach ($this->inventory as $sku => $stock) {
            unset($this->inventory[$sku]['reservations'][$id]);
        }
    }

    public function invoice(string $id): array
    {
        $order = $this->order($id);
        return [
            'number' => 'INV-' . $id,
            'customer' => $order['customer'],
            'currency' => $order['currency'],
            'lines' => array_values($order['lines']),
            'subtotal' => $this->subtotal($id),
            'discount' => $order['discount'],
            'tax' => $this->tax($id),
            'shipping' => $order['shipping'],
            'total' => $this->total($id),
        ];
    }

    public function customerOrders(string $customerId): array
    {
        return array_filter($this->orders, function (array $order) use ($customerId): bool {
            return $order['customer'] === $customerId && $order['state'] !== 'cancelled';
        });
    }

    public function outstandingBalance(string $id): int
    {
        $total = $this->total($id);
        $captured = $this->payments[$id]['captured'] ?? 0;
        return max(0, $total - $captured);
    }

    public function refundableBalance(string $id): int
    {
        $payment = $this->payment($id);
        return max(0, $payment['captured'] - $payment['refunded']);
    }

    public function reconcile(string $id, array $remote): bool
    {
        $payment = $this->payment($id);
        $matches = $payment['captured'] === $remote['captured']
            && $payment['refunded'] === $remote['refunded'];
        if (!$matches) {
            $this->recordEvent('payment.mismatch', ['id' => $id, 'remote' => $remote]);
        }
        return $matches;
    }

    public function dailySales(DateTimeImmutable $day): array
    {
        $date = $day->format('Y-m-d');
        $totals = [];
        foreach ($this->orders as $id => $order) {
            if ($order['created_at']->format('Y-m-d') !== $date) {
                continue;
            }
            $payment = $this->payments[$id] ?? null;
            if ($payment) {
                $currency = $order['currency'];
                $totals[$currency] = ($totals[$currency] ?? 0) + $payment['captured'] - $payment['refunded'];
            }
        }
        return $totals;
    }

    public function exportLedger(): array
    {
        $rows = [];
        foreach ($this->payments as $id => $payment) {
            $rows[] = [
                'order' => $id,
                'reference' => $payment['reference'],
                'captured' => $payment['captured'],
                'refunded' => $payment['refunded'],
                'currency' => $this->orders[$id]['currency'],
            ];
        }
        usort($rows, fn(array $a, array $b): int => $a['order'] <=> $b['order']);
        return $rows;
    }

    public function restockReturn(string $id, array $quantities): void
    {
        $order = $this->order($id);
        foreach ($quantities as $sku => $quantity) {
            $line = $order['lines'][$sku] ?? null;
            if (!$line || $quantity <= 0 || $quantity > $line['quantity']) {
                throw new DomainException('Invalid return quantity');
            }
        }
        foreach ($quantities as $sku => $quantity) {
            $this->inventory[$sku]['available'] += $quantity;
        }
        $this->recordEvent('return.restocked', ['id' => $id, 'quantities' => $quantities]);
    }

    public function paymentReceipt(string $id): string
    {
        $payment = $this->payment($id);
        $order = $this->order($id);
        return implode('|', [
            $id,
            $payment['reference'],
            (string) $payment['captured'],
            $order['currency'],
        ]);
    }

    public function updateAddress(string $id, array $address): void
    {
        $this->assertDraft($id);
        foreach (['street', 'city', 'postcode', 'country'] as $key) {
            if (trim($address[$key] ?? '') === '') {
                throw new DomainException('Missing address field: ' . $key);
            }
        }
        $this->orders[$id]['address'] = array_intersect_key($address, array_flip([
            'street', 'city', 'postcode', 'country',
        ]));
    }

    public function fraudScore(string $id, array $signals): int
    {
        $order = $this->order($id);
        $score = 0;
        if (($signals['ip_country'] ?? '') !== ($order['country'] ?? '')) {
            $score += 25;
        }
        if (($signals['failed_attempts'] ?? 0) >= 3) {
            $score += 40;
        }
        if ($this->total($id) > 500000) {
            $score += 20;
        }
        return min(100, $score);
    }

    public function retryableFailure(Throwable $error): bool
    {
        if ($error instanceof DomainException) {
            return false;
        }
        $message = strtolower($error->getMessage());
        return str_contains($message, 'timeout') || str_contains($message, 'temporarily');
    }

    public function stockSnapshot(): array
    {
        return array_map(function (array $stock): array {
            return [
                'available' => $stock['available'],
                'reserved' => array_sum(array_column($stock['reservations'], 'quantity')),
            ];
        }, $this->inventory);
    }

    public function deleteDraft(string $id): void
    {
        $this->assertDraft($id);
        unset($this->orders[$id]);
        $this->recordEvent('order.deleted', ['id' => $id]);
    }

    public function discountDescription(string $id): string
    {
        $order = $this->order($id);
        if ($order['discount'] === 0) {
            return 'No discount';
        }
        return ($order['coupon'] ?? 'manual') . ': ' . $order['discount'];
    }

    public function splitShipment(string $id, array $requested): array
    {
        $order = $this->order($id);
        $parcels = [];
        foreach ($requested as $warehouse => $skus) {
            $parcel = [];
            foreach ($skus as $sku) {
                if (!isset($order['lines'][$sku])) {
                    throw new DomainException('Unknown shipment line');
                }
                $parcel[$sku] = $order['lines'][$sku];
            }
            $parcels[$warehouse] = $parcel;
        }
        return $parcels;
    }

    public function validateBillingCountry(string $id, string $billingCountry): bool
    {
        $order = $this->order($id);
        $shippingCountry = $order['country'] ?? null;
        if ($shippingCountry === null || $billingCountry === '') {
            return false;
        }
        $domestic = $shippingCountry === 'TR';
        return !$domestic || $billingCountry === 'TR';
    }

    public function consumeCoupon(string $id): void
    {
        $order = $this->order($id);
        $code = $order['coupon'] ?? null;
        if ($code === null || $order['state'] !== 'paid') {
            return;
        }
        if (isset($this->orders[$id]['coupon_consumed'])) {
            return;
        }
        $this->coupons[$code]['uses']++;
        $this->orders[$id]['coupon_consumed'] = true;
    }

    public function pendingFulfillment(): array
    {
        $pending = [];
        foreach ($this->orders as $id => $order) {
            if ($order['state'] !== 'paid' || isset($this->shipments[$id])) {
                continue;
            }
            $pending[$id] = [
                'address' => $order['address'] ?? null,
                'items' => array_values($order['lines']),
            ];
        }
        return $pending;
    }

    protected function assertAmount(int $amount): void
    {
        if ($amount <= 0 || $amount > self::MAX_AMOUNT) {
            throw new DomainException('Amount outside merchant limits');
        }
    }

    private function assertCurrency(string $currency): void
    {
        if (!in_array($currency, self::ALLOWED_CURRENCIES, true)) {
            throw new DomainException('Unsupported currency: ' . $currency);
        }
    }

    private function assertDraft(string $id): void
    {
        if ($this->order($id)['state'] !== 'draft') {
            throw new DomainException('Order is immutable after reservation');
        }
    }

    private function order(string $id): array
    {
        if (!isset($this->orders[$id])) {
            throw new DomainException('Unknown order: ' . $id);
        }
        return $this->orders[$id];
    }

    private function payment(string $id): array
    {
        if (!isset($this->payments[$id])) {
            throw new DomainException('No payment for order: ' . $id);
        }
        return $this->payments[$id];
    }
}
