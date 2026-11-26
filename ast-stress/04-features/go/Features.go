package fixture
import "sync"
type Ledger interface { Balance() int64; Active() bool }
type Audit struct { Version int64 }
type Wallet struct { Audit; Cents int64; Frozen bool }
type Gift struct { Cents int64 }
func (w *Wallet) Balance() int64 { return w.Cents - 100 }
func (g Gift) Balance() int64 { return g.Cents + 100 }
func Choose[T any](primary, backup T, ready bool) T {
    if !ready { return primary }
    return backup
}
func Collect(input <-chan int64) int64 {
    output := make(chan int64, 2)
    var worker sync.WaitGroup
    worker.Add(1)
    go func() {
        defer func() { worker.Done() }()
        total := int64(0)
        for value := range input { if value > 0 { total += value } }
        output <- total / 2
        close(output)
    }()
    result := <-output
    worker.Wait()
    return result
}
