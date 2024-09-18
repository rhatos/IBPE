from bson import ObjectId
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource, reqparse
from flask import request
from database import database
from models import Tokenizer
import subprocess
from werkzeug.utils import secure_filename
import os.path

UPLOAD_FOLDER = 'bpe/uploads/tokenizerTrainingFiles'
ALLOWED_EXTENSIONS = {'txt'}

def allowed_file(filename):
  """
    Helper function to check allowed file extensions.
  """
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Creating new tokenizer request
class CreateNewTokenizer(Resource):
  """
    Resource class used to implement the create tokenizer API endpoint.
  """
  @jwt_required()
  def post(self):
    """
      Enables this endpoint to accept a post request from the frontend.

      Creates a new tokenizer db entry and spawns an instance of the training python file
      with the given arguments.
    """
    
    args = create_tokenizer_args.parse_args()

    # Get arguments specified by frontend
    name = args.get("name")
    subword_vocab_count = args.get("subword_vocab_count")
    username = get_jwt_identity()
    user = database.users.find_one({"username": username})
    user_id = str(user['_id'])

    # URI of the uploaded file
    training_file = f"{secure_filename(str(args.get("training_file")))}"
    
    tokenizer = Tokenizer(name, subword_vocab_count, user_id, training_file).getObject()
 
    # Find the user that trained it.
    if database.users.find_one({"_id": ObjectId(user_id)}):

      models = database.models.find({'user_id': user_id})
      num_models = 1
      for models in models:
         num_models+=1
      
      # Ensure no user has more than 20 models + 1 for pretrained model
      if num_models >= 21:
         return {'error': 'More than 20 models trained on this account.'}, 400

      # Model name validation - cannot name 2 models the same name
      if database.models.find_one({"user_id": user_id, "name": name}):
        return {"error": "A model with that name already exists"}, 400

      # Check that file exists
      file_path = "bpe/uploads/tokenizerTrainingFiles/"+training_file
      if(not os.path.isfile(file_path)):
        return {"error": f"File doesn't exist {file_path}"}, 400

      # Create entry in the tokenizer database
      tokenizer_id = database.models.insert_one(tokenizer)

      # Get id of inserted entry
      tokenizer_id = str(tokenizer_id.inserted_id)
 
      # Spawn new instance of the BPE Training
      print(f"[TRAINING JOB]: {tokenizer_id} for {user_id} > Training File > {training_file}")
          
      # These inputs need to be santitised for security purposes
      process = subprocess.Popen(['python', 'bpe/BPETraining.py', tokenizer_id, subword_vocab_count, "bpe/uploads/tokenizerTrainingFiles/"+training_file], stdout=None, stderr=None)

      # Add tokenizer ID to user db entry
      query_filter = {'_id': ObjectId(user_id)}
      push_operation = {'$push': {'models': tokenizer_id}}
      database.users.update_one(query_filter, push_operation)

      return {"message": "Tokenizer created, training started", "tokenizer_id": tokenizer_id}, 200
    else:
      return {"error": "No user found"}, 400

class DeleteTokenizer(Resource):
  """
    Resource class used to implement the delete tokenizer API endpoint.
  """
  @jwt_required()
  def post(self):
    """
      Enables the backend to accept a post request from the frontend which deletes a trained tokenizer
      based on the given arguments.
    """

    args = delete_tokenizer_args.parse_args()

    tokenizer_id = args.get("tokenizer_id")
    username = get_jwt_identity()
    user = database.users.find_one({"username": username})
    user_id = str(user['_id'])

    # Find user and delete model id from trained_models
    if(database.users.find_one({'_id': ObjectId(user_id)})):

      query_filter_users_db = {'_id': ObjectId(user_id)}
      query_filter_models_db = {'_id': ObjectId(tokenizer_id)}

      if(database.models.find_one({'_id': ObjectId(tokenizer_id)})):

        # Delete from users db
        delete_operation = {'$unset': {'models': tokenizer_id}}
        database.users.update_one(query_filter_users_db, delete_operation)

        # Delete from models db
        database.models.delete_one(query_filter_models_db)

        return {"message": "Tokenizer deleted"}, 200
      else:
        return {"error": "Tokenizer not found"}, 400

    else:
      return {"error": "No user found"}, 400

class UpdateTokenizer(Resource):
  """
    Resource class used to implement the update tokenizer API endpoint.
  """
  @jwt_required()
  def post(self):
    """
      Enables the backend to accept a post request from the frontend which
      renames a trained models based on the given arguments.
    """
    args = update_tokenizer_args.parse_args()

    tokenizer_id = args.get("tokenizer_id")
    username = get_jwt_identity()
    user = database.users.find_one({"username": username})
    user_id = str(user['_id'])
    tokenizer_new_name = args.get("tokenizer_new_name")

    # Find model to update
    if(database.models.find_one({"_id": ObjectId(tokenizer_id), "user_id": user_id})):
      
      # Check that the user isn't changing the name to an already existing name
      if(database.models.find_one({"name": tokenizer_new_name, "user_id": user_id})):
        return {"error": "A model with that name already exists"}, 400
      else:
        # Update model name
        query_filter = {'_id': ObjectId(tokenizer_id)}
        update_operation = {'$set': {'name': tokenizer_new_name}}
        database.models.update_one(query_filter, update_operation)
        return {"message": "Model name updated successfully"}, 200
    else:
      return {"error": "Cannot find model"}, 400

class TokenizerFinishedTraining(Resource):
  """
    Resource class to implement an endpoint in which the BPETraining.py program can post to
    in order to indicate it is done training.
  """
  def post(self):
    """
      Enables the backend to accept a post request from BPETraining.py instance
      to indicate it is done training.

      The related entry is then updated in the db with the given arguments by the instance.
    """
    args = finish_training_args.parse_args()

    tokenizer_id = args.get("_id")
    tokenizer_training_time = args.get("training_time")
    tokens = args.get("tokens")
    
    # Change the tokenizer entry's trained to true
    # And set training time
    query_filter = {'_id' : ObjectId(tokenizer_id)}
    update_operation = {'$set' : {
      'trained' : 'true',
      'training_time': tokenizer_training_time,
      'tokens': tokens
    }}

    # Search for the tokenizer in the db and update
    if database.models.find_one({"_id": ObjectId(tokenizer_id)}):
      database.models.update_one(query_filter, update_operation)
      print(f"[TRAINING JOB]: {tokenizer_id} completed in {tokenizer_training_time}s")
      return {"success": "Training completed"}, 200
    else:
      return {"error": "Tokenizer not found"}, 400
    
  
class UploadTrainingFile(Resource):
    """
      Resource class used to implement an upload file API endpoint for uploading a training set.
    """
    @jwt_required()
    def post(self):
        """
          Enables this endpoint to have a post request sent to it.

          Creates and formats the file based on the username and how many instances a user is training.
        """
        if 'file' not in request.files:
            return {'error': 'No file part'}, 400
        
        file = request.files['file']

        # Check if the file uploaded is empty
        if file.readline().decode('utf-8') == '':
           return {'error': 'File content is empty'}, 400 

        if file.filename == '':
            return {'error': 'No selected file'}, 400
        
        if file and allowed_file(file.filename):
            username = get_jwt_identity()
            original_filename = secure_filename(file.filename)
            base_filename, file_extension = os.path.splitext(original_filename)
            
            # Construct the pattern to match user files
            user_file_pattern = f"{username}_{base_filename}"
            
            # List all files in the upload folder
            existing_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.startswith(user_file_pattern) and f.endswith(file_extension)]
            
            if len(existing_files) >= 3:
                return {'error': 'Too many models being trained'}, 400
            
            # Generate a unique filename if the file already exists
            temp = 1
            new_filename = f"{username}_{original_filename}"
            file_path = os.path.join(UPLOAD_FOLDER, new_filename)
            
            while os.path.exists(file_path):
                new_filename = f"{username}_{base_filename}_{temp}{file_extension}"
                file_path = os.path.join(UPLOAD_FOLDER, new_filename)
                temp += 1
            file.seek(0) # Reset the file cursor
            file.save(file_path)
            
            return {'message': 'File uploaded successfully','file_name': new_filename}, 200
        else:
            return {'error': 'File type not allowed'}, 400
        
class CheckTrainingStatus(Resource):
    """
      Resource class used to implement an endpoint which enables checking the current status of an ongoing/complete training
      of a tokenizer by the frontend.
    """
    def get(self):
        """
          Enables this endpoint to accept a get request sent to it.

          Queries the db by the tokenizer id and gets it's trained status.
        """
        args = check_training_args.parse_args()
        _id = args.get('tokenizer_id')
        # Query the model by name and user_id
        model = database.models.find_one({"_id": ObjectId(_id)})

        if model:
            # Check if the model is trained
            trained_status = model.get('trained', 'false')
            return {"tokenizer_id": _id, "trained": trained_status}, 200
        else:
            return {"error": "Model not found"}, 404
      

# Requests Arguments

# Tokenizer Finished Training Args
finish_training_args = reqparse.RequestParser()
finish_training_args.add_argument("_id", type=str, help="ID Missing", location="json", required=True)
finish_training_args.add_argument("training_time", type=float, help="Training time missing", location="json", required=True)
finish_training_args.add_argument("tokens", type=list, help="Tokens missing", location="json", required=True)


# Create Tokenizer Args
create_tokenizer_args = reqparse.RequestParser()
create_tokenizer_args.add_argument("name", type=str, help="Tokenizer name missing", location="json", required=True)
create_tokenizer_args.add_argument("subword_vocab_count", type=str, location="json", required=True)
# create_tokenizer_args.add_argument("user_id", type=str, location="json", required=False)
create_tokenizer_args.add_argument("training_file", type=str, location="json", required=True)

# Delete Tokenizer Args
delete_tokenizer_args = reqparse.RequestParser()
delete_tokenizer_args.add_argument("tokenizer_id", type=str, help="Tokenizer id missing", location="json", required=True)

# Update Tokenizer Args
update_tokenizer_args = reqparse.RequestParser()
update_tokenizer_args.add_argument("tokenizer_id", type=str, help="Tokenizer id missing", location="json", required=True)
update_tokenizer_args.add_argument("tokenizer_new_name", type=str, help="New name missing", location="json", required=True)

# Check Training Status Args
check_training_args = reqparse.RequestParser()
check_training_args.add_argument('tokenizer_id', type=str, help='Tokenizer id missing', location='args', required=True)