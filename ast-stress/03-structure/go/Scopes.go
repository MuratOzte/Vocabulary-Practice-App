package fixture
type WalletScope struct {}
type GiftScope struct {}
func (w WalletScope) Validate(cents int64) bool { return cents > 0 }
func (g GiftScope) Validate(cents int64) bool { return cents <= 1000 }
