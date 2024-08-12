import uuid
from passlib.hash import pbkdf2_sha256
from flask import jsonify

class User():
  def __init__(self, username, email, password):
    self.username = username
    self.email = email
    self.password = pbkdf2_sha256.encrypt(password)
    self._id = uuid.uuid4().hex
  
  def getObject(self):
    return {
      "_id": self._id,
      "username": self.username,
      "email": self.email,
      "password": self.password
    }
  
  

