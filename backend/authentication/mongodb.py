import os
from pymongo import MongoClient
from django.conf import settings
import logging
from .config import MONGODB_URI, MONGODB_DB_NAME, USERS_COLLECTION, PREDICTIONS_COLLECTION, TOKENS_COLLECTION, HISTORY_COLLECTION

logger = logging.getLogger(__name__)

class MongoDBConnection:
    _client = None
    _db = None
    
    @classmethod
    def get_client(cls):
        if cls._client is None:
            try:
                cls._client = MongoClient(MONGODB_URI)
                logger.info("Connected to MongoDB successfully")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                raise
        return cls._client
    
    @classmethod
    def get_database(cls):
        if cls._db is None:
            client = cls.get_client()
            cls._db = client[MONGODB_DB_NAME]
        return cls._db
    
    @classmethod
    def get_collection(cls, collection_name):
        db = cls.get_database()
        return db[collection_name]

# MongoDB collections
def get_users_collection():
    return MongoDBConnection.get_collection(USERS_COLLECTION)

def get_tokens_collection():
    return MongoDBConnection.get_collection(TOKENS_COLLECTION)

def get_predictions_collection():
    return MongoDBConnection.get_collection(PREDICTIONS_COLLECTION)

def get_historical_collection():
    return MongoDBConnection.get_collection(HISTORY_COLLECTION)
