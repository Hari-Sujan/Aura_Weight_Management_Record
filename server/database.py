import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://Vercel-Admin-auracentre:jJX8CXEK2FGUyQZl@auracentre.k37o2xv.mongodb.net/?retryWrites=true&w=majority&appName=auracentre"
)

client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
db = client["auracentre"]
collection = db["adminuser"]

def get_master_data():
    try:
        # Fetch strictly from MongoDB without creating fallback default documents
        doc = collection.find_one({"adminuserdata": {"$exists": True}}) or collection.find_one({})
        if doc:
            doc["_id"] = str(doc.get("_id", ""))
            return doc
        return {
            "users": [],
            "admins": [],
            "records": []
        }
    except Exception as e:
        print(f"Database error in get_master_data: {e}")
        raise e

def update_master_data(data: dict):
    try:
        data.pop("_id", None)
        data["adminuserdata"] = True
        collection.replace_one({"adminuserdata": {"$exists": True}}, data, upsert=True)
        return get_master_data()
    except Exception as e:
        print(f"Database error in update_master_data: {e}")
        raise e
