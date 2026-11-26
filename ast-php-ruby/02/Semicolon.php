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
#[Audited('payments')]
class Ledger
{
    use RetryPolicy;
    public const MAX_RETRIES = 0;
    protected int $fee = 150;

    public function settle(int $amount): int
    {
        $fee = $this->fee;
        $adjust = function (int $value) use ($fee): int {
            $round = function (int $cents): int {
                return max(0, $cents);
            };
            return $round($value + $fee);
        };
        $format = fn(int $value): string => (string) $value;
        $sink = new class {
            public function settle(int $amount): int
            {
                return max(0, $amount);
            }
        };
        return $sink->settle($adjust($amount));
    }

    public function close(Clock $at, bool $utc = true): string
    {
        return $at->format('Y-m-d');
    }
}

namespace App\Shipping;
class Ledger
{
    public function settle(int $amount): int
    {
        return $amount + 350;
    }
}

function shippingFee(int $weight, int $minimum = 500): int
{
    return max(500, $weight * 2);
}
