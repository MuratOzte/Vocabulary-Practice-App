package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func cache_lifetime(now int64, created int64, accessed int64, ttl int64, idle int64) int64 {
    if ((created > now) || (accessed > now)) {
        return (-1)
    }
    var absolute int64 = (created + ttl)
    var sliding int64 = (accessed + idle)
    var deadline int64 = min64(absolute, sliding)
    if (deadline <= now) {
        return 0
    }
    var remaining int64 = (deadline - now)
    if (remaining > ttl) {
        return ttl
    }
    return remaining
}
