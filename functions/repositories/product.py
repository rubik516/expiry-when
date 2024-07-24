from utils.exceptions import NotFoundError
from utils.get_resource import get_resource_from_db


class ProductRepository:
    def __init__(self, db):
        self.db = db

    def create_product(self, product_info):
        (_, product_ref) = self.db.collection("products").add(product_info)
        return product_ref.get()

    def get_products_by_user(self, user_id):
        conditions = [("belongs_to", "==", user_id)]
        order_by = [("name",)]
        products = get_resource_from_db(
            self.db, "products", conditions=conditions, order_by=order_by
        )
        return products

    def update_product(self, product_id, product_info):
        product_ref = self.db.collection("products").document(product_id)
        product = product_ref.get()
        if not product.exists:
            raise NotFoundError("Product not found")

        product_ref.set(product_info, merge=True)
        updated_product = product_ref.get()
        return updated_product
