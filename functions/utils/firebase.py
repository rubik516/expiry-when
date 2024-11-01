from firebase_admin import credentials, firestore, initialize_app


class FirebaseInstance:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        service_account_file = "gcloud_key.json"
        cred = credentials.Certificate(service_account_file)
        _ = initialize_app(cred)
        self.db = firestore.client()

    def get_db(self):
        return self.db
