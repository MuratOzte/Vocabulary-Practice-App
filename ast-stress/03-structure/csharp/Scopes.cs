class WalletScope { bool Validate(long cents) { return cents >= 0; } }
class GiftScope { bool Validate(long cents) { return cents < 1000; } }
