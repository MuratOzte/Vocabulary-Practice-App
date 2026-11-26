<?php
namespace Stress;
final class RetryPolicy
{
    public function delay(int $attempt): int
    {
        return min(3600, 60 * 2 ** $attempt);
    }
}
