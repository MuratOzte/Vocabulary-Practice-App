package fixture
type Repository struct {}
func (r Repository) Load(key, currency string) Order { return Order{Cents: 1000, Currency: currency} }
