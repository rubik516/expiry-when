class NotFoundError(Exception):
    def __init__(self, message="Resource not found."):
        self.message = f"{message}"
        super().__init__(self.message)

class AlreadyExistsError(Exception):
    def __init__(self, message="Resource already exists."):
        self.message = f"{message}"
        super().__init__(self.message)

class ForbiddenError(Exception):
    def __init__(self, message="Forbidden to access resource."):
        self.message = f"{message}"
        super().__init__(self.message)

class UnauthorizedError(Exception):
    def __init__(self, message="Unauthorized to access resource."):
        self.message = f"{message}"
        super().__init__(self.message)
