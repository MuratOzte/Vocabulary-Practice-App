from math import ceil
LIMIT = 200
class Policy:
    active = False
    currency = "TRY"
    @classmethod
    def quote(
        cls,
        miktar_ö: float,
        rate: int = 10,
    ) -> float:
        return miktar_ö * rate
LABEL = "İzmir 😀"
