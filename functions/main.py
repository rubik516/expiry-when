"""
From Cloud Functions docs:
https://cloud.google.com/functions/docs/writing#directory-structure-python

"Cloud Functions loads source code from a file named main.py at the root of
your function directory. Your main file must be named main.py. The code in
your main.py file must define your function entry point and can import other
code and external dependencies as normal. The main.py file can also define
multiple function entry points that can be deployed separately."

Considering that the current project structure follows the service-oriented
architecture with separate layers for repositories, services and controllers,
this main.py file will act as the "controllers" layer, which exposes the APIs
(cloud functions entry points) for the client(s) to interact with.
"""

from firebase_functions import https_fn
import json

from repositories.product import ProductRepository
from repositories.user import UserRepository
from services.product import ProductService
from services.user import UserService
from utils.exceptions import (
    AlreadyExistsError,
    BadRequestError,
    ForbiddenError,
    MethodNotAllowedError,
    NotFoundError,
    UnauthorizedError,
)
from utils.firebase import FirebaseInstance
from utils.requests import validate_authorization, validate_request
from utils.request_methods import RequestMethod
from validators.validate_product import validate_product
from validators.validate_user import validate_user


firebase_app = FirebaseInstance()
db = firebase_app.get_db()

user_repo = UserRepository(db)
user_service = UserService(user_repo)

product_repo = ProductRepository(db)
product_service = ProductService(product_repo)


@https_fn.on_request()
def create_product(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.POST.value:
            raise MethodNotAllowedError()

        product_info = request.get_json()
        validated_product_info = validate_product(product_info)
        validated_product_info["belongs_to"] = user_id
        product = product_service.create(validated_product_info)
        return https_fn.Response(
            f"Product with ID {product.id} added.", status=201
        )
    except ForbiddenError as error:
        print(f"Error creating product: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error creating product: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except UnauthorizedError as error:
        print(f"Error creating product: {error}")
        return https_fn.Response("Unauthorized", status=401)


@https_fn.on_request()
def create_user(request: https_fn.Request) -> https_fn.Response:
    try:
        validate_request(request)
        if request.method.upper() != RequestMethod.POST.value:
            raise MethodNotAllowedError()

        user_info = request.get_json()
        if "uid" not in user_info or "is_anonymous" not in user_info:
            raise BadRequestError("Missing required params in body")

        validated_user_info = validate_user(user_info)
        user = user_service.create(validated_user_info)

        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": user, "status": 201}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=201)
    except AlreadyExistsError as error:
        print(f"Error creating user: {error}")
        return https_fn.Response(f"User already exists: {error}", status=409)
    except BadRequestError as error:
        print(f"Error creating user: {error}")
        return https_fn.Response(f"Bad request: {error}", status=400)
    except ForbiddenError as error:
        print(f"Error creating user: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error creating user: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except UnauthorizedError as error:
        print(f"Error creating user: {error}")
        return https_fn.Response("Unauthorized", status=401)


@https_fn.on_request()
def delete_product(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.DELETE.value:
            raise MethodNotAllowedError()

        product_id = request.get_json()["product_id"]
        if not product_id:
            raise BadRequestError("Missing product_id in body")

        product_service.delete(product_id, user_id)
        return https_fn.Response(
            f"Product with ID {product_id} successfully deleted.", status=204
        )
    except BadRequestError as error:
        print(f"Error deleting product: {error}")
        return https_fn.Response(f"Bad request: {error}", status=400)
    except ForbiddenError as error:
        print(f"Error deleting product: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error deleting product: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except NotFoundError as error:
        print(f"Error deleting product: {error}")
        return https_fn.Response("Product does not exist", status=404)
    except UnauthorizedError as error:
        print(f"Error deleting product: {error}")
        return https_fn.Response("Unauthorized", status=401)


@https_fn.on_request()
def finish_product_today(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.PATCH.value:
            raise MethodNotAllowedError()

        product_id = request.get_json()["product_id"]
        if not product_id:
            raise BadRequestError("Missing product_id in body")

        product = product_service.finish_today(product_id, user_id)
        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": product, "status": 200}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=200)
    except BadRequestError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response(f"Bad request: {error}", status=400)
    except ForbiddenError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except NotFoundError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Product does not exist", status=404)
    except UnauthorizedError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Unauthorized", status=401)


@https_fn.on_request()
def get_products_by_user(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.GET.value:
            raise MethodNotAllowedError()

        products = product_service.get_all_by_user(user_id)

        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": products, "status": 200}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=200)
    except ForbiddenError as error:
        print(f"Error retrieving products for {user_id}: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error retrieving products for {user_id}: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except NotFoundError as error:
        print(f"Error retrieving products for {user_id}: {error}")
        return https_fn.Response("User does not exist", status=404)
    except UnauthorizedError as error:
        print(f"Error retrieving products for {user_id}: {error}")
        return https_fn.Response("Unauthorized", status=401)
    except Exception as error:
        print(f"Error: {error}")
        return https_fn.Response("Internal Server Error", status=500)


@https_fn.on_request()
def get_user(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        if request.method.upper() != RequestMethod.GET.value:
            raise MethodNotAllowedError()

        user = user_service.get(user_id)

        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": user, "status": 200}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=200)
    except ForbiddenError as error:
        print(f"Error retrieving user: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error retrieving user: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except NotFoundError as error:
        print(f"Error retrieving user: {error}")
        return https_fn.Response("Not Found", status=404)
    except UnauthorizedError as error:
        print(f"Error retrieving user: {error}")
        return https_fn.Response("Unauthorized", status=401)
    except Exception as error:
        print(f"Error: {error}")
        return https_fn.Response("Internal Server Error", status=500)


@https_fn.on_request()
def start_product_today(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.PATCH.value:
            raise MethodNotAllowedError()

        product_id = request.get_json()["product_id"]
        if not product_id:
            raise BadRequestError("Missing product_id in body")

        product = product_service.start_today(product_id, user_id)
        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": product, "status": 200}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=200)
    except BadRequestError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response(f"Bad request: {error}", status=400)
    except ForbiddenError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except NotFoundError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Product does not exist", status=404)
    except UnauthorizedError as error:
        print(f"Error updating product: {error}")
        return https_fn.Response("Unauthorized", status=401)


@https_fn.on_request()
def update_user_last_login(request: https_fn.Request) -> https_fn.Response:
    try:
        user_id = validate_request(request)
        validate_authorization(user_id)
        if request.method.upper() != RequestMethod.PATCH.value:
            raise MethodNotAllowedError()

        user = user_service.update_last_login(user_id)

        headers = {"Content-Type": "application/json"}
        response = {"message": "Success", "data": user, "status": 200}
        json_response = json.dumps(response)
        return https_fn.Response(json_response, headers=headers, status=200)
    except ForbiddenError as error:
        print(f"Error updating user: {error}")
        return https_fn.Response("Forbidden", status=403)
    except MethodNotAllowedError as error:
        print(f"Error updating user: {error}")
        return https_fn.Response("Method Not Allowed", status=405)
    except UnauthorizedError as error:
        print(f"Error updating user: {error}")
        return https_fn.Response("Unauthorized", status=401)
