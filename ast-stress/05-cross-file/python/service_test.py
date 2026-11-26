from .service import Service
from .repository import Repository

def test_quote():
    assert Service(Repository()).quote("a") == 1000
