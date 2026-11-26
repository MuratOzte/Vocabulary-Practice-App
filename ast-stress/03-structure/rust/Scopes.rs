struct WalletScope;
struct GiftScope;
impl WalletScope { fn validate(&self, cents: i64) -> bool { cents > 0 } }
impl GiftScope { fn validate(&self, cents: i64) -> bool { cents <= 1000 } }
