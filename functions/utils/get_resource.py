from google.cloud.firestore import Client, Query
from typing import Generator

from utils.exceptions import InternalServerError


def get_resource_from_db(
    db: Client, collection_name: str, conditions=None, order_by=None
):
    try:
        query = db.collection(collection_name)

        if conditions:
            for attribute, operation, value in conditions:
                query = query.where(attribute, operation, value)

        if order_by:
            for item in order_by:
                if len(item) == 1:
                    attribute = item[0]
                    direction = Query.ASCENDING  # Default to ASCENDING
                elif len(item) == 2:
                    attribute, direction = item
                else:
                    raise ValueError(f"Invalid order_by item: {item}")
                query = query.order_by(attribute, direction=direction)

        results = query.stream()
        return serialize(results)
    except Exception as error:
        print(f"Error: {error}")
        # Docs for compound queries: https://firebase.google.com/docs/firestore/query-data/queries#compound_and_queries
        raise InternalServerError(
            f"Cannot get resource from {collection_name}. If the query is compound, it may need composite indexes. Check the database Indexes settings for more info."
        )


def serialize(data: Generator):
    serialized_data = []
    for item in data:
        serialized_item = item.to_dict()
        if item.id:
            serialized_item["id"] = item.id
        serialized_data.append(serialized_item)
    return serialized_data
