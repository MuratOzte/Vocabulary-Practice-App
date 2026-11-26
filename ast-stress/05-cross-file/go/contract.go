package fixture
type Pricing interface { Quote(key, currency string) int64 }
