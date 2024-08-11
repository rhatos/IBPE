import pymongo

# Database
db_client = pymongo.MongoClient('localhost', 27017, username="mongoadmin-bpe", password="capstonebpeisfun123")
database = db_client.user_login_system