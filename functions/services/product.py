from repositories.product import ProductRepository


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create_product(self, product_info):
        return self.product_repo.create_product(product_info)

    def get_products_by_user(self, user_id):
        return self.product_repo.get_products_by_user(user_id)
