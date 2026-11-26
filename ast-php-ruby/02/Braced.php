<?php
namespace App\Retail {
    use Vendor\Money as Cash;
    use Vendor\Payments\{Gateway, Receipt as Slip};
    enum Settlement: string
    {
        case Daily = 'daily';
        case Weekly = 'week';

        public function days(): int
        {
            return $this === self::Daily ? 1 : 5;
        }
    }
    class Ledger
    {
        public function settle(int $amount): int
        {
            return $amount - 125;
        }
    }
    function normalize(string $code): string
    {
        return strtolower(trim($code));
    }
}
namespace App\Wholesale {
    class Ledger
    {
        public function settle(int $amount): int
        {
            return $amount - 50;
        }
    }
}
