from firebase_admin import firestore
from repositories.product import ProductRepository


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create_product(self, product_info):
        product_info["created_at"] = firestore.SERVER_TIMESTAMP
        product_info["updated_at"] = firestore.SERVER_TIMESTAMP
        return self.product_repo.create_product(product_info)

    def get_products_by_user(self, user_id):
        products = self.product_repo.get_products_by_user(user_id)
        converted_products = list(
            map(
                lambda product: {
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
                },
                products,
            )
        )
        return converted_products
