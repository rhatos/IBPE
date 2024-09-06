from bson import ObjectId
from flask_restful import Resource, reqparse
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import database
from models import Tokenizer

class GetTrainedModels(Resource):
  @jwt_required
  def get(self):
    # Get username from JWT header
    username = get_jwt_identity()
    
    ##args = get_models_args.parse_args()
    ##username = args.get('username')
    
    
    # Get user object from the db
    user = database.users.find_one({"username": username})

    # User exists in the db continue
    if user:

      # Get that user's ID
      user_id = str(user['_id'])

      # Create query to get user's trained models
      models = database.models.find({'user_id': user_id}, {})

      # Create empty list for their models
      model_list = []

      num_models = 1
      
      # Append each model to the list
      for model in models:

        # Have to convert id into string as ObjectId is not a generic type
        model['_id'] = str(ObjectId(model['_id']))
        model_list.append(model)
        num_models+=1
      
      return {"num_of_models": num_models, "models": model_list}, 200


    
##get_models_args =  reqparse.RequestParser()
##get_models_args.add_argument("username", type=str, help="Test ID Missing", location="json", required=True)
