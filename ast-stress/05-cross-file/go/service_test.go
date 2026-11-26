package fixture
import "testing"
func TestQuote(t *testing.T) { if NewService(Repository{}, 50).Quote("a", "try") != 1050 { t.Fatal("quote") } }
