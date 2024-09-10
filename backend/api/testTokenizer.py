from bson import ObjectId
from flask_restful import Resource, reqparse
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify, request
from database import database
from models import TokenizedText
from werkzeug.utils import secure_filename
import subprocess
import time
import os.path

UPLOAD_FOLDER = 'bpe/uploads/testTokenizerFiles'
ALLOWED_EXTENSIONS = {'txt'}

# Helper function to check the allowed file extensions
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class CreateTestTokenizer(Resource):
  @jwt_required()
  def post(self):
    # Request arguments
    args = create_test_tokenizer_args.parse_args()

    # Get arguments specified by frontend
    name = args.get("test_name")
    username = get_jwt_identity()
    user = database.users.find_one({"username": username})
    user_id = str(user['_id'])
    tokenizer_id = args.get("tokenizer_id") # The tokenizer used to test this text
    input_text = args.get("input_text")     # Text option for an input

    # URI of uploaded file
    input_file = args.get("input_file")

    tokenized_test = TokenizedText(name, tokenizer_id, input_text, input_file, user_id).getObject()

    # Find the user that sent the request
    if database.users.find_one({"_id": ObjectId(user_id)}):
      
      # Tokens of the selected model
      tokenizer_tokens = []

      # Ensure the selected model exists -> update tokenizer_tokens variable to contain the tokens of that model
      if database.models.find_one({"_id": ObjectId(tokenizer_id)}):
        tokenizer_tokens_db = dict(database.models.find_one({"_id": ObjectId(tokenizer_id)}, {"tokens": 1}))
        for token in tokenizer_tokens_db["tokens"]:
          tokenizer_tokens.append(token)  
      else:
        return {"error": "Selected model does not exist"}, 400
      
      # Need to check if input_text and input_file are not empty
      if(input_text == None and input_file == None):
        return {"error": "No input text or file specified"}, 400

      # Test name validation - cannot name 2 tests the same name
      if database.tests.find_one({"user_id": user_id, "name": name}):
        return {"error": "A test with that name already exists"}, 400
      
      # Create entry in the test tokenizer database
      test_id = database.tests.insert_one(tokenized_test)

      # Get id of inserted entry
      test_id = str(test_id.inserted_id)

      # Spawn new instance of the tokenization
      # If an input file was specified
      if(input_file != None):
      
        # Make sure file exists
        file_path = "bpe/uploads/testTokenizerFiles/"+input_file
        if(not os.path.isfile(file_path)):
          return {"error": f"File doesn't exist${file_path}"}, 400

        print(f"[TOKENIZATION JOB]: {test_id} for {user_id} > Test File > {input_file}")
        process = subprocess.Popen(['python', 'bpe/BPETesting.py', test_id, "file", "bpe/uploads/testTokenizerFiles/"+input_file] + tokenizer_tokens, stdout=None, stderr=None)
        
        # Add test ID to user db entry
        query_filter = {'_id': ObjectId(user_id)}
        push_operation = {'$push': {'tokenized_texts': test_id}}
        database.users.update_one(query_filter, push_operation)

        return {"message": "Test job created, tokenization started", 'test_id': test_id}, 200
      else:
        

        
        # If input text was specified
        print(f"[TOKENIZATION JOB]: {test_id} for {user_id} > Text Input")
        sprocess = subprocess.Popen(['python', 'bpe/BPETesting.py', test_id, "text", input_text] + tokenizer_tokens)
        
        # Add test ID to user db entry
        query_filter = {'_id': ObjectId(user_id)}
        push_operation = {'$push': {'tokenized_texts': test_id}}
        database.users.update_one(query_filter, push_operation)

        return {"message": "Test job created, tokenization started", 'test_id': test_id}, 200
      

    else:
      return {"error": "No user found"}, 400


# Request from testingTokenizer itself - which is running separate
# I.e: BPETesting.py will send a request to here
class TokenizerFinishedTesting(Resource):
  def post(self):
    args = finish_testing_args.parse_args()

    test_id = args.get("_id")
    tokenization_time = args.get("tokenization_time")
    tokenized_text = args.get("tokenized_text")
    output_file = args.get("output_file")
    statistics = args.get("statistics")

    # Ensure that the test ID exists in the db
    if(database.tests.find_one({"_id": ObjectId(test_id)})):

      # Check that POST request includes either text or file
      if(tokenized_text == None and output_file == None):
        return {"error": "No output text or file specified"}, 400
      
      # Update the db entry to contain outputs of tokenization
      query_filter = {'_id' : ObjectId(test_id)}
      update_operation = {'$set' : {
        "tokenized": True,
        "output_file": output_file,
        "tokenized_text": tokenized_text,
        "tokenization_time": tokenization_time,
        "statistics": statistics
      }}
      database.tests.update_one(query_filter, update_operation)

      print(f"[TOKENIZATION JOB]: {test_id} completed in {tokenization_time}s")

      return {"message": "Tokenization complete"}, 200

    return {"error": "An error occured"}, 400


class UploadTestFile(Resource):
  @jwt_required()
  def post(self):
    if 'file' not in request.files:
      return {'error': 'No file part'}, 400
    
    file = request.files['file']

    if file.filename == '':
      return {'error': 'No selected file'}, 400
    
    if file and allowed_file(file.filename):
      username = get_jwt_identity()
      original_filename = secure_filename(file.filename)
      base_filename, file_extension = os.path.splitext(original_filename)

      # Epoch time
      upload_time = int(time.time())

      # Construct the pattern to match user files
      # Add on upload time for cleanup later
      user_file = f"{username}_{base_filename}_{upload_time}{file_extension}"
      file_path = os.path.join(UPLOAD_FOLDER, user_file)

      file.save(file_path)

      return {'message': 'File uploaded successfully', 'file_name': user_file}, 200
    else:
      return {'error': 'File type not allowed'}, 400

class CheckTokenizationStatus(Resource):
  def get(self):
    args = check_tokenization_args.parse_args()

    test_id = args.get('test_id')

    # Query the database for the test by its id
    test = database.tests.find_one({"_id": ObjectId(test_id)})

    if test:
      # Check if the tokenizer is complete
      test_status = test.get('tokenized', 'false')
      is_file = test.get('input_file')
      is_text = test.get('input_text')

      # Return different response whether it was a file input or text input
      if is_file:
        output_file = test.get('output_file')
        statistics = test.get('statistics')
        tokenization_time = test.get('tokenization_time')
        return {
                "tokenized": test_status, 
                "output_file": output_file, 
                "statistics": statistics,
                "tokenization_time": tokenization_time
                }, 200
      elif is_text:
        statistics = test.get('statistics')
        tokenized_text_html = test.get('tokenized_text')['html_body']
        tokenization_time = test.get('tokenization_time')
        return {
          "tokenized": test_status,
          "statistics": statistics,
          "tokenization_time": tokenization_time,
          "tokenized_text_html": tokenized_text_html
        }, 200

    else:
      return {'error': "Test not found"}, 404



# Request Arguments

# Check Tokenization arguments
check_tokenization_args =  reqparse.RequestParser()
check_tokenization_args.add_argument("test_id", type=str, help="Test ID Missing", location="json", required=True)

# Tokenizer finished testing arguments
finish_testing_args = reqparse.RequestParser()
finish_testing_args.add_argument("_id", type=str, help="ID Missing", location="json", required=True)
finish_testing_args.add_argument("tokenization_time", type=float, help="Tokenization time missing", location="json", required=True)
finish_testing_args.add_argument("tokenized_text", type=dict, help="Tokenized text missing", location="json", required=False)
finish_testing_args.add_argument("output_file", type=str, help="Output file missing", location="json", required=False)
finish_testing_args.add_argument("statistics", type=dict, help="Statistics missing", location="json", required=True)

# Create test arguments
create_test_tokenizer_args = reqparse.RequestParser()
create_test_tokenizer_args.add_argument("user_id", type=str, help="User ID Missing", location="json", required=True)
create_test_tokenizer_args.add_argument("tokenizer_id", type=str, help="Model ID Missing", location="json", required=True)
create_test_tokenizer_args.add_argument("test_name", type=str, help="Test name Missing", location="json", required=True)
create_test_tokenizer_args.add_argument("input_text", type=str, help="Input text Missing", location="json", required=False)
create_test_tokenizer_args.add_argument("input_file", type=str, help="Input file Missing", location="json", required=False)
