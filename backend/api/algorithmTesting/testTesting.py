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


def run_create_test_tokeniser_endpoint_text(jwt, user_id, tokeniser_id, test_name, input_text, input_file):
    url = "http://127.0.0.1:5000/api/tokenizer-test/create"  
    headers = {
        "Authorization": f"Bearer {jwt}",
        "Content-Type": "application/json"
    }
    data = {
        "user_id": user_id,
        "tokenizer_id": tokeniser_id,
        "test_name": test_name,
        "input_text": input_text,
        "input_file": input_file
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

def test(jwt, user_id, tokeniser_id, test_name, input_text, input_file):
    run_create_test_tokeniser_endpoint_text(jwt, user_id, tokeniser_id, test_name, input_text, input_file)

def run_all_training_tests():
    # TESTS FOR USER 1:
    username = "Ronald"
    password = "Ronald Is Cool 67"
    jwt = get_jwt_token(username=username, password=password)

    # Test 1:
    user_id = "66d719eccda7a42b28a3c21f"
    tokeniser_id = "66e2fb1783c6c17a018edd85"
    test_name = "test 1"
    input_text = "text"
    input_file = "This is the text I want to tokenise"
    test(jwt, user_id, tokeniser_id, test_name, input_text, input_file)

run_all_training_tests()