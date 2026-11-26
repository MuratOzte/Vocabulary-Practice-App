class Wallet:
    def validate(self, cents):
        return cents > 0

class Gift:
    def validate(self, cents):
        return cents <= 1000
