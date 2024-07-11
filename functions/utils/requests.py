from firebase_functions import https_fn
from firebase_admin import auth

from utils.exceptions import ForbiddenError, UnauthorizedError


def verify_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        return uid
    except auth.InvalidIdTokenError:
        return None
    except ValueError:
        return None


def validate_request(request: https_fn.Request):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise UnauthorizedError("Missing Authorization header")

    id_token = authorization_header.replace("Bearer", "").strip()
    user_id = verify_id_token(id_token)
    if not user_id:
        raise ForbiddenError()
    return user_id
