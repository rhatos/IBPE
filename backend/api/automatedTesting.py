import requests, time
from pymongo import MongoClient
from bson.objectid import ObjectId

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
    #upload file
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
    subword_size=500
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_10mil_words.txt"
    expected_tokens = ['th', 'the</w>', 'in', 're', 'an', 'ti', 'en', 'on', 'er', 'of</w>', 'to</w>', 'ar', 'on</w>', 'ro', 'or', 'ou', 'and</w>', 'is</w>', 'is', 'te', 'in</w>', 'al', 'ing</w>', 'it', 'at</w>', 'om', 'si', 'es', 'ati', 'al</w>', 'li', 'an</w>', 'ec', 'that</w>', 'es</w>', 'men', 'ed</w>', 'or</w>', 'ha', 've</w>', 'ac', 'er</w>', 'ic', 'at', 'il', 'su', 'pro', 'le', 'tr', 'ly</w>', 'wh', 'pe', 'us', 'for</w>', 'no', 'po', 'ta', 'Th', 'de', 'as', 'con', 'as</w>', 'uro', 'Euro', 'por', 'el', 'un', 'en</w>', 'res', 'we</w>', 'ur', 'op', 'be', 'this</w>', 'ci', 'ad', 'be</w>', 'ation</w>', 'ts</w>', 'are</w>', 'le</w>', 'ld</w>', 'Europe', 'ver', 'omm', 'ag', 'im', 'it</w>', 'not</w>', 'ul', 'ation', 'have</w>', 'em', 'ne', 'ould</w>', 'lo', 'ment</w>', 'European</w>', 'tion</w>', 'ab', 'oun', 'ith</w>', 't,</w>', 's,</w>', 's.</w>', 'ig', 'with</w>', 'ted</w>', 'the', 'di', 'ter', 'tion', 'for', 'ex', 'The</w>', 'sh', 'den', 'Comm', 'ce</w>', 'wil', 'com', 'am', 'ol', 'will</w>', 'y,</w>', 'whic', 'by</w>', 'ity</w>', 'which</w>', 'vi', 'ere</w>', 'st', 'so</w>', 'ch', 'ed', 'issi', 'ate</w>', 'our</w>', 'ff', 'ap', 'bu', 'ke</w>', 'qu', 'se', 'uc', 'wor', 'me', 'ing', 'ma', 'has</w>', 'mo', 'Commissi', 'igh', 'resi', 'residen', 'par', 'all</w>', 'emb', 'Presiden', 'ust</w>', 'ni', 'tic', 'st</w>', 'port', 'ment', 'ir', 'ate', 'also</w>', 'y.</w>', 'ther</w>', 'cr', 'pos', 'ren', 'to', 'pr', 'we', 'out</w>', 'pl', 'coun', 'port</w>', 'rec', 'would</w>', 'Mr</w>', 'reg', "'s</w>", 'go', 'our', 'rom</w>', 'e,</w>', 'tate', 'tri', 'poli', 'from</w>', 'und', 'ant</w>', 'Memb', 'ay</w>', 'We</w>', 'so', 'se</w>', 'Uni', 'ers</w>', 'pec', 'should</w>', 'ar</w>', 'e.</w>', 'tu', 'co', 'must</w>', 'and', 'ting</w>', 'but</w>', 'ir</w>', 'lia', 'Par', 'dis', 'very</w>', 'ent</w>', 'per', 'um', 'Member</w>', 'es.</w>', 'ally</w>', 'ge', 'es,</w>', 'ra', 'one</w>', 'ou</w>', 'been</w>', 'rou', 'ke', 'its</w>', 'State', 'fin', 'ore</w>', 'inc', 'ic</w>', 'str', 'President,</w>', 'ese</w>', 'It</w>', 'Parlia', 'use</w>', 'iti', 'able</w>', 'vel', 'righ', 'can</w>', 'econ', 'their</w>', 'ear', 'all', 'pres', 'more</w>', 'sup', 'you</w>', 'was</w>', 'tur', 'Commission</w>', 'comm', 'ten', 'vo', 'tive</w>', 'any</w>', 'ess', 'cial</w>', '20', 'am</w>', 'like</w>', 'import', 'ess</w>', 'ev', 'king</w>', 'do', 'duc', 'me</w>', 'ter</w>', 'ple', 'tions</w>', 'lu', 'th</w>', 'ord', 'gen', 'fe', 'ations</w>', 'Commission', 'This</w>', 'sa', 'ch</w>', 've', 'cy</w>', 'gr', 't.</w>', 'are', 'us</w>', 'gi', 'bec', 'ge</w>', 'ments</w>', 'conc', 'do</w>', 'sti', 'mar', 'pre', 'fac', 'ho', 'EU</w>', 'pu', 'In</w>', 'sib', 'Coun', 'leg', 'ard', 'sur', 'ary</w>', 'there</w>', 'he', 'they</w>', 'these</w>', 'ational</w>', 'other</w>', 'te</w>', 'need</w>', 'ste', 'ance</w>', 'la', 'countri', 'fo', 'ain', 'bet', 'ob', 'min', 'wi', 'propos', 'fu', 'ous</w>', 'econom', 'inter', 'ion', 'sec', 'peop', 'reas', 'agre', 'ffic', 'ans', 'about</w>', 'ome</w>', 'my</w>', 'acc', 'who</w>', 'd,</w>', 'gu', 'jec', 'de</w>', 'od</w>', 'devel', 'national</w>', 'ser', 'Union</w>', 'ms</w>', 'new</w>', 'tab', 'States</w>', 'gy</w>', 'wel', 'now</w>', 'important</w>', 'dec', 'Parliament</w>', 'gh', 'ause</w>', 'what</w>', 'anc', 'report</w>', 'only</w>', 'ding</w>', 'd.</w>', 'fr', 'ver,</w>', 'issu', 'cont', 'work</w>', 'pen', 'ies</w>', 'ay', 'mon', 'fore</w>', 'ose</w>', 'olu', 'ing.</w>', '200', 'ty</w>', 'ade</w>', 'develop', 'with', 'tly</w>', 'pe</w>', 'because</w>', 'marke', 'reat', 'bo', 'ise</w>', 'oper', 'ves</w>', 'cil</w>', 'Council</w>', 'fir', 'ach', 'ly,</w>', 'form', 'res</w>', 'pon', 'fi', 'wever,</w>', 'support</w>', 'tical</w>', 'ffec', 'gre', 'id</w>', 'red</w>', 'tor', 'sure</w>', 'du', 'ticul', 'sit', 'fa', 'inte', 'such</w>', 'sion</w>', 'chan', 'tec', 'gh</w>', 'proc', 'eve</w>', 'trans', 'ated</w>', 'people</w>', 'particul', 'ques', 'citi', 'vis', 'year', 'prob', 'there', 'if</w>', 'er,</w>', 'Europe</w>', 'poin', 'ener', 'ast</w>', 'ving</w>', 'up</w>', 'peci', 'no</w>', 'ish</w>', 'sy', 'take</w>', 'ility</w>', 'ween</w>', 'again', 'cle', 'sel', 'produc', 'deb', 'between</w>', 'ish', 'ion</w>', 'pri', 'inv', 'citiz', 'wn</w>', 'rel', 'respon', 'countries</w>', 'fic', 'ep', 'cour', 'tain', 'into</w>', 're,</w>', 'ver</w>', 'ard</w>', 'ative</w>', 'those</w>', 'ven', 'protec', 'citizen', 'proble', 'age</w>', 'ong</w>', 'au', 'make</w>', 'hum', 'thin', 'itte', 'economic</w>', 'ement</w>', 'EU', 'concer', 'alis']
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    print(f"Test 1: {success}")

run_all_training_tests()