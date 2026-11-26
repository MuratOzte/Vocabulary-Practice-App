class WalletScope { boolean validate(long cents) { return cents > 0; } }
class GiftScope { boolean validate(long cents) { return cents <= 1000; } }
