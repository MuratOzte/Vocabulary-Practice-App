package fixture
import "sync"
type Ledger interface { Balance() int64 }
type Audit struct { Version int64 }
type Wallet struct { Audit; Cents int64 }
type Gift struct { Cents int64 }
func (w *Wallet) Balance() int64 { return w.Cents }
func (g Gift) Balance() int64 { return g.Cents }
func Choose[T any](primary T, backup T, ready bool) T {
    if ready { return primary }
    return backup
}
func Collect(input <-chan int64) int64 {
    output := make(chan int64, 1)
    var worker sync.WaitGroup
    worker.Add(1)
    go func() {
        defer worker.Done()
        total := int64(0)
        for value := range input { total += value }
        output <- total
        close(output)
    }()
    result := <-output
    worker.Wait()
    return result
}
