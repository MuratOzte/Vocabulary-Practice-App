from math import floor
LIMIT = 100
class Policy:
    active = True
    obsolete = 7
    @staticmethod
    def quote(
        miktar: int,
        rate: int = 10,
    ) -> int:
        return miktar * rate
LABEL = "İstanbul 😀"
