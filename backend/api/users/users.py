from flask_restful import Resource, reqparse

class UserRegistration(Resource):

  # Frontend sends a GET request to check if this account exists
  # If it doesn't then it should return false for both fields
  # In that case, frontend sends a post request
  # Otherwise, frontend receives a true and tells the user accordingly

  # GET Request
  # Check if user is registered:
  def get(self):

    # Define arguments for GET request
    args = user_register_get_args.parse_args()
    username = args.get("username")
    email = args.get("email")

    email_exists = False
    username_exists = False

    # Database logic code here

    #db.query(username) ... returns true or false
    # etc

    # DEBUG CODE
    return {"usernameExists": username_exists, "emailExists": email_exists, "username": username, "email": email}
    ####

    return {"usernameExists": username_exists, "emailExists": email_exists}
  
  # POST Request
  # Create new user
  def post(self):
    
    # Define arguments required for POST
    args = user_register_post_args.parse_args()
    username = args.get("username")
    email = args.get("email")
    password = args.get("password")

    account_created = False

    # Save to db here
    # ...
    
    # If there was some issue and the db was unable to create a new entry
    # then set an appropriate error message here
    error_msg = ""

    # Creation was successful
    account_created = True

    # DEBUG CODE
    return {"accountCreated": account_created, "username": username, "email": email, "password": password}
    ####

    if(account_created):
      return {"accountCreated": account_created}
    else:
      return {"accountCreated": account_created, "errorMsg": error_msg}

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
    




# Login Request arguments
user_login_get_args = reqparse.RequestParser()
user_login_get_args.add_argument("username", type=str, help="Username value missing!", location="json", required=True)
user_login_get_args.add_argument("password", type=str, help="Password value missing!", location="json", required=True)

# Register Request arguments
user_register_get_args = reqparse.RequestParser()
user_register_get_args.add_argument("username", type=str, help="Username value missing!", location="json", required=True)
user_register_get_args.add_argument("email", type=str, help="Email value missing!",location="json", required=True)

user_register_post_args = reqparse.RequestParser()
user_register_post_args.add_argument("username", type=str, help="Username value missing!", location="json", required=True)
user_register_post_args.add_argument("email", type=str, help="Email value missing!",location="json", required=True)
user_register_post_args.add_argument("password", type=str, help="Password value missing!",location="json", required=True)

