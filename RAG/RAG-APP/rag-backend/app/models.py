from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo

class User:
    @staticmethod
    def create_user(email, password):
        hashed_password = generate_password_hash(password)
        user = mongo.db.users.find_one({"email": email})
        if user:
            return None
        mongo.db.users.insert_one({"email": email, "password": hashed_password})
        return True

    @staticmethod
    def verify_user(email, password):
        user = mongo.db.users.find_one({"email": email})
        if user and check_password_hash(user['password'], password):
            return True
        return False
