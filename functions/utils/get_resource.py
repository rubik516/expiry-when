from firebase_functions import https_fn
from google.cloud.firestore import Client
import json

def get_resource_from_db(db: Client, collection_name: str) -> https_fn.Response:
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
