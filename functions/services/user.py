from repositories.user import UserRepository

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create_user(self, user_info):
        return self.user_repo.create_user(user_info)

    def get_user(self, user_id):
        return self.user_repo.get_user(user_id)
