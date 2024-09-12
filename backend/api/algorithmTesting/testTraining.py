import requests, time
from pymongo import MongoClient
from bson.objectid import ObjectId
import bpe

def get_jwt_token(username, password):
    url = "http://127.0.0.1:5000/api/user/login"  
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "username": username,
        "password": password
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)

        response_data = response.json()
        
        if response.status_code == 200 and "access_token" in response_data:
            return response_data["access_token"]
        else:
            print("Response data:", response_data)
            raise Exception("Failed to obtain JWT token: " + response_data.get("message", "Unknown error"))
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise

def upload_training_file(jwt_token, file_path):
    url = "http://127.0.0.1:5000/api/tokenizer/upload"  # Replace with your actual endpoint URL
    headers = {
        "Authorization": f"Bearer {jwt_token}"
    }
    files = {
        "file": open(file_path, "rb")  # Open the file in binary read mode
    }

    try:
        response = requests.post(url, headers=headers, files=files)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)

        response_data = response.json()
        
        if response.status_code == 200:
            print("File uploaded successfully:", response_data)
        else:
            print("Response data:", response_data)
            raise Exception("Failed to upload file: " + response_data.get("error", "Unknown error"))
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise

def run_create_new_tokeniser_endpoint(jwt_tokens, url, name, subword_count, user_id, training_file):
    headers = {
        "Authorization": f"Bearer {jwt_tokens}",
        "Content-Type": "application/json"
    }
    data = {
        "name": name,
        "subword_vocab_count": subword_count,
        "user_id": user_id,
        "training_file": training_file
    }
    try:
        # Step 1: Create a new tokenizer
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        tokenizer_id = response_data.get('tokenizer_id')
        return tokenizer_id
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise

def run_check_training_status_endpoint(jwt_tokens, url, tokenizer_id):
    headers = {
        "Authorization": f"Bearer {jwt_tokens}",
        "Content-Type": "application/json"
    }
    params = {
        "tokenizer_id": tokenizer_id
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        trained_status = response_data.get('trained')
        return trained_status
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise

def read_tokens_in_db(tokeniser_id, expected_tokens):
    client = MongoClient('mongodb://capstone2024:changeme123@localhost:27017/')  # replace with your MongoDB URI
    database = client['db']  # replace with your database name
    collection = database['models']  # replace with your collection name
    document = collection.find_one({"_id": ObjectId(tokeniser_id)})
    
    if document:
        tokens = document.get('tokens', [])
        if tokens == expected_tokens:
            success = "passed"
            return success
        else:
            success = "failed"
            return success
    else:
        return f"Tokenizer with ID {tokeniser_id} not found."
    

def train_test(jwt_token, file_path, name, subword_count, user_id, training_file, expected_tokens):
    upload_training_file(jwt_token, file_path)
    
    create_url = "http://127.0.0.1:5000/api/tokenizer/create"
    trained_status = "http://127.0.0.1:5000/api/tokenizer/status"

    tokeniser_id = run_create_new_tokeniser_endpoint(jwt_tokens=jwt_token, url=create_url, name=name, subword_count=subword_count, user_id=user_id, training_file=training_file)
    
    status = False
    i = 0
    while status == False:
        status = run_check_training_status_endpoint(jwt_tokens=jwt_token, url=trained_status, tokenizer_id=tokeniser_id)
        time.sleep(2)
        if i == 15:
            print("Training failed.")
            break
    if  status == "true":
        success = read_tokens_in_db(tokeniser_id, expected_tokens)
        return success
    else:
        return "Training failed"

def run_all_training_tests():
    # TESTS FOR USER 1:
    username = "Ronald"
    password = "Ronald Is Cool 67"
    jwt = get_jwt_token(username=username, password=password)

    # Test 1:
    file = "10mil words.txt" 
    tokeniser_name = "Tokeniser1"
    subword_size=1000
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_10mil_words.txt"
    originalTokeniser = bpe.BPEoriginal()
    expected_tokens = originalTokeniser.main(subword_size, file)
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    test1 = success

    # Test 2:
    file = "emojitext.txt" 
    tokeniser_name = "Tokeniser2"
    subword_size=1000
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_emojitext.txt"
    originalTokeniser = bpe.BPEoriginal()
    expected_tokens = originalTokeniser.main(subword_size, file)
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    test2 = success

    # Test 3:
    file = "one_million_words_1.txt" 
    tokeniser_name = "Tokeniser3"
    subword_size=10000
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_one_million_words_1.txt"
    originalTokeniser = bpe.BPEoriginal()
    expected_tokens = originalTokeniser.main(subword_size, file)
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    test3 = success

    # Test 4:
    file = "one_million_words_2.txt" 
    tokeniser_name = "Tokeniser4"
    subword_size=10000
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_one_million_words_2.txt"
    originalTokeniser = bpe.BPEoriginal()
    expected_tokens = originalTokeniser.main(subword_size, file)
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    test4 = success

    with open("testOutput.txt", "w", encoding="utf-8") as file:
        file.write(f"Test 1: {test1}\n")
        file.write(f"Test 2: {test2}\n")
        file.write(f"Test 3: {test3}\n")
        file.write(f"Test 4: {test4}\n")

run_all_training_tests()