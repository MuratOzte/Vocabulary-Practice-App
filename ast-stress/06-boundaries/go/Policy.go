package fixture // head
import m "math"
const Limit = 200
type Policy struct { Active bool; Currency string }
func Quote(
    miktar float64,
    rate float64,
) int64 {
    return int64(m.Floor(miktar * rate))
}
const Label = "İzmir 😀"
