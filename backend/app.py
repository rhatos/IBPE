from flask import Flask
from flask_restful import Api, Resource
from api.users import UserRegistration, UserLogin, UserLogoutAccess, UserLogoutRefresh, TokenRefresh
from flask_jwt_extended import JWTManager
from dotenv import dotenv_values

# ENV Values
config = dotenv_values(".env")

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'change-me'

# JWT
jwt = JWTManager(app)

# API
api = Api(app)

# Add api routes
api.add_resource(UserRegistration, "/api/user/register")
api.add_resource(UserLogin, "/api/user/login")
api.add_resource(UserLogoutAccess, "/api/user/logout/access")
api.add_resource(UserLogoutRefresh, "/api/user/logout/refresh")
api.add_resource(TokenRefresh, "/api/user/token/refresh")

if __name__ == "__main__":

  app.run(debug=True)