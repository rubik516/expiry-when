from firebase_functions import https_fn
from firebase_admin import auth

from utils.exceptions import UnauthorizedError
from utils.firebase import FirebaseInstance


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
        raise UnauthorizedError("Invalid credentials.")
    return user_id


def validate_authorization(user_id):
    firebase_app = FirebaseInstance()
    db = firebase_app.get_db()
    user_ref = db.collection("users").document(user_id)
    user = user_ref.get()
    if not user.exists:
        raise UnauthorizedError("Missing required authorization.")
