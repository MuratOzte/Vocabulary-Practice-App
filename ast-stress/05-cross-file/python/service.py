from .repository import Repository

class Service:
    def __init__(self, repository: Repository):
        self.repository = repository

    def quote(self, key: str) -> int:
        return self.repository.load(key).cents
