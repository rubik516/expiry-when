from utils.exceptions import UnauthorizedError
from utils.get_resource import get_resource_from_db


class ProductRepository:
    def __init__(self, db):
        self.db = db

    def create_product(self, product_info):
        product_ref = self.db.collection("products").add(product_info)
        return product_ref

    def get_products_by_user(self, user_id):
        user_ref = self.db.collection("users").document(user_id)
        user = user_ref.get()
        if not user.exists:
            raise UnauthorizedError("Missing Authorization header")

        conditions = [("belongs_to", "==", user_id)]
        order_by = [("name",)]
        products = get_resource_from_db(
            self.db, "products", conditions=conditions, order_by=order_by
        )
        return products
