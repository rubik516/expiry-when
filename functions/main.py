from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore, credentials
import json

service_account_file = './gcloud_key.json'
cred = credentials.Certificate(service_account_file)
app = initialize_app(cred)
db = firestore.client()


def get_resource_collection(req: https_fn.Request, collection_name: str) -> https_fn.Response:
    try:
        ref = db.collection(collection_name)
        docs = ref.stream()
        serialized_data = []
        for doc in docs:
            serialized_data.append(doc.to_dict())
        response = {
            "message": "Success",
            "data": serialized_data,
            "status": 200
        }
        json_response = json.dumps(response)
        headers = {"Content-Type": "application/json"}
        return https_fn.Response(json_response, headers=headers, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return https_fn.Response("Internal Server Error", status=500)


@https_fn.on_request()
def get_people(req: https_fn.Request) -> https_fn.Response:
    return get_resource_collection(req, 'people')


@https_fn.on_request()
def get_products(req: https_fn.Request) -> https_fn.Response:
    return get_resource_collection(req, 'products')


@https_fn.on_request()
def create_person(req: https_fn.Request) -> https_fn.Response:
    _, doc_ref = db.collection("people").add({"name": "TS", "hobbies": ["cats", "songwriting"]})
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")


@https_fn.on_request()
def create_product(req: https_fn.Request) -> https_fn.Response:
    product = req.get_json()
    _, doc_ref = db.collection("products").add(product)
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")