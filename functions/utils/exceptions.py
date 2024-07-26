class AlreadyExistsError(Exception):
    def __init__(self, message="Resource already exists."):
        self.message = f"{message}"
        super().__init__(self.message)


class BadRequestError(Exception):
    def __init__(self, message="Malformed or invalid request."):
        self.message = f"{message}"
        super().__init__(self.message)


class ForbiddenError(Exception):
    def __init__(self, message="Forbidden to access resource."):
        self.message = f"{message}"
        super().__init__(self.message)


class InternalServerError(Exception):
    def __init__(self, message="Internal Server Error."):
        self.message = f"{message}"
        super().__init__(self.message)


class MethodNotAllowedError(Exception):
    def __init__(self, message="Method Not Allowed."):
        self.message = f"{message}"
        super().__init__(self.message)


class NotFoundError(Exception):
    def __init__(self, message="Resource not found."):
        self.message = f"{message}"
        super().__init__(self.message)


class UnauthorizedError(Exception):
    def __init__(self, message="Unauthorized to access resource."):
        self.message = f"{message}"
        super().__init__(self.message)
