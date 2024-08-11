from flask import Flask
from flask_restful import Api, Resource
from users.users import UserRegistration, UserLogin

app = Flask(__name__)
api = Api(app)

# Add api routes
api.add_resource(UserRegistration, "/api/user/register")
api.add_resource(UserLogin, "/api/user/login")

if __name__ == "__main__":

  app.run(debug=True)