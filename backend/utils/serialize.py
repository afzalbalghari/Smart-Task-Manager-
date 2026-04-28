"""
Utility to convert MongoDB documents to JSON-safe dicts.
Handles ObjectId -> str and datetime -> ISO string.
"""
from datetime import datetime
from bson import ObjectId


def serialize_doc(doc: dict) -> dict:
    """Recursively make a MongoDB document JSON-serializable."""
    result = {}
    for key, val in doc.items():
        if key == "_id":
            result["id"] = str(val)
        elif isinstance(val, ObjectId):
            result[key] = str(val)
        elif isinstance(val, datetime):
            result[key] = val.isoformat()
        elif isinstance(val, dict):
            result[key] = serialize_doc(val)
        elif isinstance(val, list):
            result[key] = [
                serialize_doc(i) if isinstance(i, dict) else
                str(i) if isinstance(i, (ObjectId, datetime)) else i
                for i in val
            ]
        else:
            result[key] = val
    return result
