<?php
declare(strict_types=1);
namespace App\Billing;
use DateTimeImmutable as Clock;
use Vendor\Payments\{Gateway as RemoteGateway, Receipt};

#[\Attribute]
class Audited
{
    public function __construct(public string $scope) {}
}
trait RetryPolicy
{
    protected function retryDelay(int $attempt): int
    {
        return min(3600, 30 * (2 ** $attempt));
    }
}
#[Audited('billing')]
class Ledger
{
    use RetryPolicy;
    public const MAX_RETRIES = 3;
    protected int $fee = 100;

    public function settle(int $amount): int
    {
        $fee = $this->fee;
        $adjust = function (int $value) use ($fee): int {
            $round = function (int $cents): int {
                return max(0, $cents);
            };
            return $round($value - $fee);
        };
        $format = fn(int $value): string => (string) $value;
        $sink = new class {
            public function settle(int $amount): int
            {
                return $amount;
            }
        };
        return $sink->settle($adjust($amount));
    }

    public function close(Clock $at): string
    {
        return $at->format('Y-m-d');
    }
}

namespace App\Shipping;
class Ledger
{
    public function settle(int $amount): int
    {
        return $amount + 250;
    }
}

function shippingFee(int $weight): int
{
    return max(500, $weight * 2);
}
