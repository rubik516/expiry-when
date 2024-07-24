from datetime import datetime, timezone
from firebase_admin import firestore
from repositories.product import ProductRepository
from utils.requests import validate_authorization


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def __convert_timestamp(self, product):
        return {
            **product,
            "created_at": (
                int(product["created_at"].timestamp() * 1000)
                if "created_at" in product
                else None
            ),
            "updated_at": (
                int(product["updated_at"].timestamp() * 1000)
                if "updated_at" in product
                else None
            ),
        }

    def create_product(self, product_info):
        product_info["created_at"] = firestore.SERVER_TIMESTAMP
        product_info["updated_at"] = firestore.SERVER_TIMESTAMP
        return self.product_repo.create_product(product_info)

    def get_products_by_user(self, user_id):
        validate_authorization(user_id)

        products = self.product_repo.get_products_by_user(user_id)
        converted_products = list(map(self.__convert_timestamp, products))
        return converted_products

    def start_today(self, user_id, product_id):
        validate_authorization(user_id)

        product_info = {
            "is_active": True,
            "open_date": int(datetime.now(timezone.utc).timestamp() * 1000),
            "total_daytime_uses": 0,
            "total_nighttime_uses": 0,
            "total_uses": 0,
            "updated_at": firestore.SERVER_TIMESTAMP,
        }
        updated_product = self.product_repo.update_product(product_id, product_info)

        serialized_product = updated_product.to_dict()
        serialized_product = self.__convert_timestamp(serialized_product)
        if updated_product.id:
            serialized_product["id"] = updated_product.id
        return serialized_product
