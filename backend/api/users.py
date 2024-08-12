from flask_restful import Resource, reqparse
from flask import jsonify
from database import database

from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required
from models import User

class UserRegistration(Resource):

  # POST Request
  # Create new user
  def post(self):
    
    # Define arguments required for POST
    args = user_register_post_args.parse_args()
    _username = args.get("username")
    _email = args.get("email")
    _password = args.get("password")

    user = User(_username, _email, _password).getObject()

    # Check for existing email address
    if database.users.find_one({"email": user['email']}):
      return {"error": "Email address in use"}, 400
    
    # Check for existing username
    if database.users.find_one({"username": user['username']}):
      return {"error": "Username exists"}, 400

    # Save to db here
    if database.users.insert_one(user):
      return {"success": "User created"}, 200

    return {"error": "Register failed"}, 400

class UserLogin(Resource):
  def get(self):
    return {"message": "none"}
  
  # Login POST request
  def post(self):
    args = user_login_get_args.parse_args()
    username = args.get("username")
    password = args.get("password")

    credentials_correct = False

    # DB Logic
    ###
    ###

    credentials_correct = True

    # JWT Logic
    # Assign JWT

    return {"loginSuccessful": credentials_correct}
    
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

