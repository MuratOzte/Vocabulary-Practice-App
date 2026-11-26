package fixture
type Repository struct {}
func (r Repository) Load(key string) Order { return Order{Cents: 1000} }

func NormalizeCurrency(currency string) string { if currency == "" { return "TRY" }; return currency }
