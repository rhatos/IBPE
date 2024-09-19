import pymongo

# Database
db_client = pymongo.MongoClient('bpe-mongodb', 27017, username="capstone2024", password="changeme123")
database = db_client.db