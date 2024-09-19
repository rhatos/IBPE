from bson import ObjectId
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import database

class GetTrainedModels(Resource):
  """
    Resource class used to implement get all trained models API endpoint.
  """
  @jwt_required(optional=True)
  def get(self):
    """
      Enables backend to accept a get request which returns a list of all trained models
      under a specific username.

      If there is no JWT associated with the request then only the default model is returned.
    """
    # Get username from JWT header
    username = get_jwt_identity()
    
    # Get user object from the db
    user = database.users.find_one({"username": username})

    # Get default model
    default_model = database.models.find_one({'user_id': 'system'}, {})
    default_model['_id'] = str(ObjectId(default_model['_id']))
    
    # User exists in the db continue
    if user:
      # Get user object from the db
      user = database.users.find_one({"username": username})
      # Get that user's ID
      user_id = str(user['_id'])

      # Create query to get user's trained models
      models = database.models.find({'user_id': user_id}, {})
      

      # Create empty list for their models
      model_list = []
      
      model_list.append(default_model)

      num_models = 1
      
      # Append each model to the list
      for model in models:

        # Have to convert id into string as ObjectId is not a generic type
        model['_id'] = str(ObjectId(model['_id']))
        model_list.append(model)
        num_models+=1
      
      return {"num_of_models": num_models, "models": model_list}, 200
    
    else:
      # Return only the default model
      model_list = []
      model_list.append(default_model)
      return {"num_of_models": 1, "models": model_list}, 200
