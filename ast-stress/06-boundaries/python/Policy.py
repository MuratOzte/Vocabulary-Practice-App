from math import ceil
LIMIT = 200
class Policy:
    active = False
    currency = "TRY"
    @classmethod
    def quote(
        cls,
        miktar: float,
        rate: int = 10,
    ) -> float:
        return miktar * rate
LABEL = "İzmir 😀"
