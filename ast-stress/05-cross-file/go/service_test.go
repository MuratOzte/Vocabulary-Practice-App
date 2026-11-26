package fixture
import "testing"
func TestQuote(t *testing.T) { if NewService(Repository{}).Quote("a") != 1000 { t.Fatal("quote") } }
