from datetime import datetime, timezone
from firebase_admin import firestore
from repositories.product import ProductRepository
from utils.exceptions import ForbiddenError


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create(self, product_info):
        product_info["created_at"] = firestore.SERVER_TIMESTAMP
        product_info["updated_at"] = firestore.SERVER_TIMESTAMP
        return self.product_repo.create(product_info)

    def delete(self, product_id, user_id):
        self.__validate_user_permission(product_id, user_id)
        return self.product_repo.delete(product_id)

    def finish_today(self, product_id, user_id):
        self.__validate_user_permission(product_id, user_id)

        product_info = {
            "is_active": False,
            "finish_date": int(datetime.now(timezone.utc).timestamp() * 1000),
            "updated_at": firestore.SERVER_TIMESTAMP,
        }
        updated_product = self.product_repo.update(product_id, product_info)

        serialized_product = updated_product.to_dict()
        serialized_product = self.__convert_timestamp(serialized_product)
        if updated_product.id:
            serialized_product["id"] = updated_product.id
        return serialized_product

    def get_all_by_user(self, user_id):
        products = self.product_repo.get_all_by_user(user_id)
        converted_products = list(map(self.__convert_timestamp, products))
        return converted_products

    def start_today(self, product_id, user_id):
        self.__validate_user_permission(product_id, user_id)

        product_info = {
            "is_active": True,
            "open_date": int(datetime.now(timezone.utc).timestamp() * 1000),
            "total_daytime_uses": 0,
            "total_nighttime_uses": 0,
            "total_uses": 0,
        }
        updated_product = self.product_repo.update(product_id, product_info)
        updated_product = self.product_repo.overwrite_properties(
            product_id, {"updated_at": firestore.SERVER_TIMESTAMP}
        )

        serialized_product = updated_product.to_dict()
        serialized_product = self.__convert_timestamp(serialized_product)
        if updated_product.id:
            serialized_product["id"] = updated_product.id
        return serialized_product

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

    def __validate_user_permission(self, product_id, user_id):
        product = self.product_repo.get(product_id).to_dict()
        if product["belongs_to"] != user_id:
            raise ForbiddenError("Cannot access the requested product")
