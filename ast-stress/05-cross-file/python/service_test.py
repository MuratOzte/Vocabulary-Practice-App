from .service import Service
from .repository import Repository

def test_quote():
    assert Service(Repository(), 50).quote("a", "TRY") == 1050
