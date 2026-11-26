def settle(events: list[int], budget: int, retry_limit: int) -> int:
    try:
        if budget <= 0:
            return -1
        if retry_limit < 0:
            return -2
        remaining = budget
        settled = 0
        pending = 0
        failed = 0
        retries = 0
        state = 0
        for i in range(len(events)):
            amount = events[i]
            if amount == 0:
                if state == 2:
                    state = 0
                continue
            if amount < 0:
                reversal = -amount
                if reversal > settled:
                    failed += 1
                    if failed > retry_limit:
                        return -3
                    continue
                settled -= reversal
                remaining += reversal
                state = 3
                if pending > 0:
                    pending = max(0, pending - reversal)
                continue
            if state == 4:
                if retries >= retry_limit:
                    break
                retries += 1
                state = 0
            if amount > remaining:
                pending += amount
                if pending > budget:
                    failed += 1
                    state = 4
                    if failed > retry_limit:
                        break
                else:
                    state = 2
                continue
            if state == 3:
                if amount > budget // 2:
                    pending += amount
                    state = 2
                    continue
                state = 0
            if amount > 10000:
                fee = amount // 100
                if remaining < amount:
                    pending += amount
                    state = 2
                    continue
                remaining -= fee
            if remaining < amount:
                return -4
            remaining -= amount
            settled += amount
            state = 1
            if pending > 0:
                recovered = min(pending, remaining)
                if recovered > 0:
                    remaining -= recovered
                    settled += recovered
                    pending -= recovered
                    state = 1
                if pending == 0:
                    retries = 0
            if remaining == 0:
                if pending > 0:
                    state = 2
                break
        if state == 4:
            if settled == 0:
                return -5
            if retries < retry_limit:
                state = 2
        if pending > 0:
            if remaining > 0:
                recovered = min(pending, remaining)
                settled += recovered
                remaining -= recovered
                pending -= recovered
            if pending > 0:
                return -pending
        if settled > budget:
            return -6
        if remaining < 0:
            return -7
        if failed > 0:
            if settled == 0:
                return -8
        if state == 3:
            if settled == 0:
                return 0
        if retries > retry_limit:
            return -9
        return settled
    except (TypeError, OverflowError):
        return -99

def settle_safely(events, budget, retry_limit):
    try:
        return settle(events, budget, retry_limit)
    except (TypeError, OverflowError):
        return -99
