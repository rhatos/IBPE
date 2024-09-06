from flask_restful import Resource, reqparse
from flask import jsonify
from database import database
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required
from models import User
from werkzeug.security import check_password_hash
from passlib.hash import pbkdf2_sha256

class UserRegistration(Resource):

  def post(self):
    
    args = user_register_post_args.parse_args()
    username = args.get("username")
    email = args.get("email")
    password = args.get("password")
    #print(username, password, email)

    user = User(username, email, password).getObject()

    if database.users.find_one({"email": user['email']}):
      return {"error": "Email address in use"}, 400

    if database.users.find_one({"username": user['username']}):
      return {"error": "Username exists"}, 400
    
    access_token = create_access_token(identity=user['username'])
    refresh_token = create_refresh_token(identity=user['username'])

    if database.users.insert_one(user):
      return {
      "success": "User created",
      "access_token": access_token,
      "refresh_token": refresh_token,
      "username": username
    }, 200

    return {"error": "Register failed"}, 400

class UserLogin(Resource):
  
  def post(self):
    args = user_login_get_args.parse_args()
    username = args.get("username")
    password = args.get("password")

    user = database.users.find_one({"username": username})
    
    if not user:
      return {"error": "Invalid username or password"}, 400

    if not pbkdf2_sha256.verify(password, user['password']):
      return {"error": "Invalid username or password"}, 400
    
    access_token = create_access_token(identity=user['username'])
    refresh_token = create_refresh_token(identity=user['username'])

    return {
      "success": "Login successful",
      "access_token": access_token,
      "refresh_token": refresh_token,
      "username": username
    }, 200
    
class TokenRefresh(Resource):
  def post(self):
    return {"message": "Token refresh"}

class UserLogoutAccess(Resource):
  def post(self):
    return {"message": "User logout"}

class UserLogoutRefresh(Resource):
  def post(self):
    return {"message": "User logout"}

# Login Request arguments
user_login_get_args = reqparse.RequestParser()
user_login_get_args.add_argument("username", type=str, help="Username value missing!", location="json", required=True)
user_login_get_args.add_argument("password", type=str, help="Password value missing!", location="json", required=True)

# Register Request arguments
user_register_post_args = reqparse.RequestParser()
user_register_post_args.add_argument("username", type=str, help="Username value missing!", location="json", required=True)
user_register_post_args.add_argument("email", type=str, help="Email value missing!",location="json", required=True)
user_register_post_args.add_argument("password", type=str, help="Password value missing!",location="json", required=True)

