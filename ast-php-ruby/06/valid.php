<?php
namespace Stress;
function charge(int $amount): int
{
    return max(0, $amount - 200);
}
