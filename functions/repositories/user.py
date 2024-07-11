from utils.exceptions import AlreadyExistsError, NotFoundError


class UserRepository:
    def __init__(self, db):
        self.db = db

    def create_user(self, user_info):
        user_ref = self.db.collection("users").document(user_info["uid"])
        user = user_ref.get()
        if user.exists:
            raise AlreadyExistsError("User already exists.")

        user_ref.set(user_info)
        return user_ref

    def get_user(self, user_id):
        user_ref = self.db.collection("users").document(user_id)
        user = user_ref.get()
        if not user.exists:
            raise NotFoundError("User not found")
        return user
