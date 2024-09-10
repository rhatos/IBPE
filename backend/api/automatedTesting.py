import requests

def test_create_new_tokenizer():
    url = "http://127.0.0.1:5000/api/tokenizer/create"
    headers = {
        "Authorization": "Bearer <your_jwt_token>",
        "Content-Type": "application/json"
    }
    data = {
        "name": "Tokeniser2",
        "subword_vocab_count": 1000,
        "user_id": "66d719eccda7a42b28a3c21f",
        "training_file": "10mil words.txt"
    }

    expected_tokens = [
        "th", "the</w>", "in", "re", "an", "ti", "en", "on", "er", "of</w>", "to</w>", "ar",
        # Add all the remaining tokens here...
        "concer", "alis"
    ]

    # Send POST request
    response = requests.post(url, json=data, headers=headers)

    # Convert response to JSON
    actual_response = response.json()

    # Assertions
    assert response.status_code == 200, "Status code is not 200"
    assert "_id" in actual_response, "_id not found in response"
    assert "training_time" in actual_response, "training_time not found in response"
    assert "tokens" in actual_response, "tokens not found in response"
    
    # Validate the _id is a 24-character string
    assert isinstance(actual_response["_id"], str), "_id is not a string"
    assert len(actual_response["_id"]) == 24, "_id length is not 24"

    # Validate the training_time is a float
    assert isinstance(actual_response["training_time"], float), "training_time is not a float"

    # Validate the tokens list matches the expected tokens
    assert actual_response["tokens"] == expected_tokens, "Tokens do not match the expected list"

    print("Test passed!")

test_create_new_tokenizer()
