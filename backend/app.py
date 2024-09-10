import os
from flask import Flask
from flask_restful import Api, Resource
from api.users import UserRegistration, UserLogin, UserLogoutAccess, UserLogoutRefresh, TokenRefresh
from api.tokenizer import CheckTrainingStatus, CreateNewTokenizer, TokenizerFinishedTraining, DeleteTokenizer, UpdateTokenizer, UploadTrainingFile
from api.testTokenizer import CreateTestTokenizer, TokenizerFinishedTesting, CheckTokenizationStatus, UploadTestFile, DownloadTestOutput
from api.viewModels import GetTrainedModels
from flask_jwt_extended import JWTManager
from dotenv import dotenv_values
from flask_cors import CORS # type: ignore
from datetime import timedelta
from flask_apscheduler import APScheduler
from util import cleanOutputs

# ENV Values
config = dotenv_values(".env")

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['JWT_SECRET_KEY'] = 'change-me'

# Set the access token to expire after 28 days
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=28)

# JWT
jwt = JWTManager(app)

# Callback for when an access token is missing
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return {"error": "Missing or invalid token"}, 401

# Callback for when a token is expired
@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return {"error": "Token has expired"}, 401

# Callback for invalid token (e.g., wrong signature)
@jwt.invalid_token_loader
def invalid_token_response(callback):
    return {"error": "Invalid token"}, 401

# Callback for when a token is revoked
@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    return {"error": "Token has been revoked"}, 401

# API
api = Api(app)

# User endpoints
api.add_resource(UserRegistration, "/api/user/register")
api.add_resource(UserLogin, "/api/user/login")
api.add_resource(UserLogoutAccess, "/api/user/logout/access")
api.add_resource(UserLogoutRefresh, "/api/user/logout/refresh")
api.add_resource(TokenRefresh, "/api/user/token/refresh")

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

if __name__ == "__main__":
  app.run(debug=True)
