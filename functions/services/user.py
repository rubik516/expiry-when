from repositories.user import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create_user(self, user_info):
        user = self.user_repo.create_user(user_info)
        return user.to_dict()

    def get_user(self, user_id):
        user = self.user_repo.get_user(user_id)
        return user.to_dict()
