def validate_user(user_info):
    # more properties to be added when necessary
    properties = [
        "created_at",
        "is_anonymous",
        "last_login_at",
        "uid"
    ]
    extracted_data = {property: user_info[property] for property in properties if property in user_info}
    return extracted_data
