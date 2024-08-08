from flask import Blueprint

users_route = Blueprint("users_route", __name__)

@users_route.route("/users")
def getUsers():
  return "Users"

@users_route.route("/users/register")
def register():
  return "Register"