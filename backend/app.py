import os
from flask import Flask
from flask_restful import Api, Resource
from api.users import UserRegistration, UserLogin
from api.tokenizer import CheckTrainingStatus, CreateNewTokenizer, TokenizerFinishedTraining, DeleteTokenizer, UpdateTokenizer, UploadTrainingFile
from api.testTokenizer import CreateTestTokenizer, TokenizerFinishedTesting, CheckTokenizationStatus, UploadTestFile, DownloadTestOutput
from api.viewModels import GetTrainedModels
from flask_jwt_extended import JWTManager
from dotenv import dotenv_values
from flask_cors import CORS # type: ignore
from datetime import timedelta
from flask_apscheduler import APScheduler # type: ignore
from util import cleanOutputs
from database import database
import json

# ENV Values
config = dotenv_values(".env")

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['JWT_SECRET_KEY'] = 'change-me'

# Set the access token to expire after 28 days
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=28)

# JWT
jwt = JWTManager(app)

@jwt.unauthorized_loader
def unauthorized_response(callback):
    """
        Callback for when an access token is missing.
    """
    return {"error": "Missing or invalid token"}, 401

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    """
        Callback for when a token has expired.
    """
    return {"error": "Token has expired"}, 401

@jwt.invalid_token_loader
def invalid_token_response(callback):
    """
        Callback for invalid token, e.g: wrong signature.
    """
    return {"error": "Invalid token"}, 401

@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    """
        Callback for when a token is revoked.
    """
    return {"error": "Token has been revoked"}, 401

# API
api = Api(app)

# User endpoints
api.add_resource(UserRegistration, "/api/user/register")                        # User registration endpoint
api.add_resource(UserLogin, "/api/user/login")                                  # User login endpoint

# Train tokenizer endpoints
api.add_resource(CreateNewTokenizer, "/api/tokenizer/create")                   # Train new tokenizer endpoint
api.add_resource(TokenizerFinishedTraining, "/api/tokenizer/complete")          # Tokenizer finished training endpoint
api.add_resource(DeleteTokenizer, "/api/tokenizer/delete")                      # Delete tokenizer endpoint
api.add_resource(UpdateTokenizer, "/api/tokenizer/update")                      # Update tokenizer endpoint
api.add_resource(UploadTrainingFile, "/api/tokenizer/upload")                   # Upload Tokenizer endpoint
api.add_resource(CheckTrainingStatus, "/api/tokenizer/status")                  # Check tokenizer status endpoint
api.add_resource(GetTrainedModels, "/api/tokenizer/models")                     # View Models endpoint


# Test tokenizer endpoints
api.add_resource(CreateTestTokenizer, "/api/tokenizer-test/create")             # Tokenize a text endpoint
api.add_resource(TokenizerFinishedTesting, "/api/tokenizer-test/complete")      # Tokenizer finished tokenization endpoint
api.add_resource(CheckTokenizationStatus, "/api/tokenizer-test/status")         # Check tokenizer status endpoint
api.add_resource(UploadTestFile, "/api/tokenizer-test/upload")                  # Upload test file endpoint
api.add_resource(DownloadTestOutput, "/api/tokenizer-test/download")            # Download tokenized output

# APS Scheduler for deleting files after n time
# NB: This has weird behaviour when running in debug mode on flask, it will essentially fire a job twice
scheduler = APScheduler()
scheduler.start()

def init():
    """
        Initialize the default model and user on app startup.
    """
    print("[SERVER-INIT]: Initializing default model...")
    print("[SERVER-INIT]: Checking database for default model...")

    # Check the database to check if the default model is initalized already
    if(database.models.find_one({"user_id": "system"})):
        print("[SERVER-INIT]: Default model found in database.")
        print("[SERVER-INIT]: Default model successfully initialized!")
    else:
        print("[SERVER-INIT]: Can't find default model in database, creating...")
        default_model_file = open("util/defaultmodel.txt")
        default_model = json.load(default_model_file)
        print("[SERVER-INIT]: Default model json loaded!")

        print("[SERVER-INIT]: Inserting into database.")
        database.models.insert_one(default_model)
        print("[SERVER-INIT]: Default model successfully initialized!")
        default_model_file.close()

    print("[SERVER-INIT]: Initializing default user...")
    print("[SERVER-INIT]: Checking database for default user...")

    # Check the database for the default 'system' user
    if(database.users.find_one({"username": "system"})):
        print("[SERVER-INIT]: Default user found in database.")
        print("[SERVER-INIT]: Default user successfully initialized!")
    else:
        print("[SERVER-INIT]: Can't find default user in database, creating...")
        default_user_file = open("util/defaultuser.txt")
        default_user = json.load(default_user_file)
        print("[SERVER-INIT]: Default user json loaded!")

        print("[SERVER-INIT]: Inserting into database.")
        database.users.insert_one(default_user)
        print("[SERVER-INIT]: Default user successfully initialized!")

if __name__ == "__main__":
  init()
  app.run(debug=False, host='0.0.0.0')
