from utils.exceptions import AlreadyExistsError, NotFoundError


class UserRepository:
    def __init__(self, db):
        self.db = db

    def create(self, user_info):
        user_ref = self.db.collection("users").document(user_info["uid"])
        user = user_ref.get()
        if user.exists:
            raise AlreadyExistsError("User already exists.")

        user_ref.set(user_info)
        updated_user = user_ref.get()
        return updated_user

    def get(self, user_id):
        user_ref = self.db.collection("users").document(user_id)
        user = user_ref.get()
        if not user.exists:
            raise NotFoundError("User not found")
        return user

    def overwrite_properties(self, user_id, user_info):
        user_ref = self.db.collection("users").document(user_id)
        user = user_ref.get()
        if not user.exists:
            raise NotFoundError("User not found")

        user_ref.update(user_info)
        updated_user = user_ref.get()
        return updated_user

    def update(self, user_id, user_info, merge=True):
        user_ref = self.db.collection("users").document(user_id)
        user = user_ref.get()
        if not user.exists:
            raise NotFoundError("User not found")

        user_ref.set(user_info, merge=merge)
        updated_user = user_ref.get()
        return updated_user
