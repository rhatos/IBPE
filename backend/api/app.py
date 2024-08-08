from flask import Flask
from users import users_route

app = Flask(__name__)

# Register all routes
app.register_blueprint(users_route)

if __name__ == '__main__':
  app.run(debug=True)

