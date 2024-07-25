from datetime import datetime
from repositories.user import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def create(self, user_info):
        # Firebase's anonymousUser["metadata"]["creationTime"] is a ISO 8601 string value, so isoformat() is used here for consistency with existing data
        # Resource: https://rnfirebase.io/reference/auth/usermetadata
        now = datetime.now().isoformat()
        if "created_at" not in user_info:
            user_info["created_at"] = now
        if "last_login_at" not in user_info:
            user_info["last_login_at"] = now

        user = self.user_repo.create(user_info)
        return user.to_dict()

    def get(self, user_id):
        user = self.user_repo.get(user_id)
        return user.to_dict()

    def update_last_login(self, user_id):
        now = datetime.now().isoformat()
        last_login = {"last_login_at": now}

        updated_user = self.user_repo.overwrite_properties(user_id, last_login)
        return updated_user.to_dict()
