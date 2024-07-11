def validate_product(product_info):
    # more properties to be added when necessary
    properties = [
        "best_before",
        "finish_date",
        "is_active",
        "name",
        "open_date",
        "total_daytime_uses",
        "total_nighttime_uses",
        "total_uses",
        "used_within",
    ]
    extracted_data = {
        property: product_info[property]
        for property in properties
        if property in product_info
    }
    return extracted_data
