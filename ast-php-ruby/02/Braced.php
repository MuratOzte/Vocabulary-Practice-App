<?php
namespace App\Retail {
    use Vendor\Money as Cash;
    use Vendor\Payments\{Gateway, Receipt as Slip};
    enum Settlement: string
    {
        case Daily = 'daily';
        case Weekly = 'weekly';

        public function days(): int
        {
            return $this === self::Daily ? 1 : 7;
        }
    }
    class Ledger
    {
        public function settle(int $amount): int
        {
            return $amount - 75;
        }
    }
    function normalize(string $code): string
    {
        return strtoupper(trim($code));
    }
}
namespace App\Wholesale {
    class Ledger
    {
        public function settle(int $amount): int
        {
            return $amount - 25;
        }
    }
}
