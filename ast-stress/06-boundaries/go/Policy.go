package fixture // base
import "math"
const Limit = 100
type Policy struct { Active bool; Obsolete int }
func Quote(
    miktar float64,
    rate float64,
) float64 {
    return math.Floor(miktar * rate)
}
const Label = "İstanbul 😀"
