from utils.exceptions import NotFoundError
from utils.get_resource import get_resource_from_db


class ProductRepository:
    def __init__(self, db):
        self.db = db

    def create(self, product_info):
        (_, product_ref) = self.db.collection("products").add(product_info)
        return product_ref.get()

    def delete(self, product_id):
        product_ref = self.db.collection("products").document(product_id)
        product = product_ref.get()
        if not product.exists:
            raise NotFoundError("Product not found")

        product_ref.delete()

    def get_all_by_user(self, user_id):
        conditions = [("belongs_to", "==", user_id)]
        order_by = [("name",)]
        products = get_resource_from_db(
            self.db, "products", conditions=conditions, order_by=order_by
        )
        return products

    def overwrite_properties(self, product_id, product_info):
        product_ref = self.db.collection("products").document(product_id)
        product = product_ref.get()
        if not product.exists:
            raise NotFoundError("Product not found")

        product_ref.update(product_info)
        updated_product = product_ref.get()
        return updated_product

    def update(self, product_id, product_info, merge=True):
        product_ref = self.db.collection("products").document(product_id)
        product = product_ref.get()
        if not product.exists:
            raise NotFoundError("Product not found")

        product_ref.set(product_info, merge=merge)
        updated_product = product_ref.get()
        return updated_product
