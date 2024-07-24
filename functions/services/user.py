from datetime import datetime
from repositories.user import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create_user(self, user_info):
        # Firebase's anonymousUser["metadata"]["creationTime"] is a ISO 8601 string value, so isoformat() is used here for consistency with existing data
        # Resource: https://rnfirebase.io/reference/auth/usermetadata
        now = datetime.now().isoformat()
        if "created_at" not in user_info:
            user_info["created_at"] = now
        if "last_login_at" not in user_info:
            user_info["last_login_at"] = now

        user = self.user_repo.create_user(user_info)
        return user.to_dict()

    def get_user(self, user_id):
        user = self.user_repo.get_user(user_id)
        return user.to_dict()
