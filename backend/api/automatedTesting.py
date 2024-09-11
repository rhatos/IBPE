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

    # Test 2:
    file = "emojitext.txt" 
    tokeniser_name = "Tokeniser2"
    subword_size=1000
    id = "66d719eccda7a42b28a3c21f"
    training_corpus = "Ronald_emojitext.txt"
    expected_tokens = ['ti', 've</w>', 'er</w>', 'tive</w>', '",', 'us', '@us', '@user</w>', 'th', 'si', 'ga', 'Ne', 'gative</w>', 'Negative</w>', '",Negative</w>', 'Po', 'sitive</w>', 'Positive</w>', '",Positive</w>', '"@user</w>', 'in', 'an', 'ou', 'on', 'ea', 'ing</w>', 'er', 'is</w>', 'ha', 'to</w>', 'the</w>', 'RT</w>', 'or', '"RT</w>', 'UR', 'al', 'URL', 'me</w>', 'ed</w>', 'it', 'oo', 'en', 'ou</w>', 'ar', 'es', '😂",Negative</w>', 'el', 'you</w>', 'and</w>', 'on</w>', 'ee', 'it</w>', 'or</w>', 'my</w>', 'in</w>', 'no', 'st', 'li', 'wa', 'lo', 'at</w>', 'Th', 'es</w>', 'ma', 'ly</w>', 'URL",Positive</w>', '😂",Positive</w>', 'this</w>', '😭",Negative</w>', 'sh', 'for</w>', 'ke</w>', 'ro', 'ac', 'rea', 'da', 'of</w>', 'URL",Negative</w>', 'ri', '..', 'la', 'ho', 'll</w>', 'en</w>', 'ir', 'ev', 'gh', 'be</w>', 'so</w>', 'ca', '’t</w>', 'om', 'et</w>', 'le</w>', 'is', 'you', 'et', 'all</w>', 'wh', 'ra', 'sa', 'go', '’s</w>', 'ch', 'bu', 'out</w>', 'that</w>', 'to', 'I’', 'one</w>', 'ust</w>', 'the', 'wit', 'un', 'pp', 're', 'ch</w>', 'ng</w>', 'ab', 'at', 'di', 'ne', 'st</w>', 'ur', 'now</w>', 'ld</w>', 'like</w>', 'with</w>', 'I’m</w>', 'just</w>', 'am', 'ght</w>', 'ic', 'are</w>', 'se</w>', 'fu', 'was</w>', '"I</w>', 'king</w>', 'have</w>', 'ting</w>', 'day</w>', 'se', 'but</w>', 'do', '😭",Positive</w>', 'ere</w>', 'an</w>', 'hat</w>', 'ts</w>', 'get</w>', 'not</w>', '\'s</w>', 'ome</w>', 'wor', 'don', '😔",Negative</w>', 'id', 'ter</w>', 'ec', 'as', 'il', 'can', 'wan', 'ol', 'your</w>', 'be', 'bo', 'te</w>', 'na</w>', 'us</w>', 'ood</w>', 'ks</w>', 'ing', 'lea', 'wee', 'tr', 'ta', 'up</w>', 'ore</w>', 'op', 'love</w>', 'wi', 'me', 'we</w>', 'do</w>', '😍",Positive</w>', 'dy</w>', 'ys</w>', 'su', 'Than', 'po', 'mo', 'thing</w>', 'ent</w>', 'cou', 'ck</w>', 'they</w>', 're</w>', 'ear', '!!</w>', 'lly</w>', 'ever', 'he</w>', 'got</w>', 'ex', '\'t</w>', 'ds</w>', '...</w>', '😩",Negative</w>', 'ni', 'This</w>', '😊",Positive</w>', 'le', 'ying</w>', 'ell</w>', 'know</w>', 'ver', 'een</w>', 'use</w>', 'can</w>', 'ome', 'rom</w>', 'ack</w>', 'hi', 'The</w>', 'est</w>', 'about</w>', 'ce</w>', 'go</w>', 'I\'', 'if</w>', 'de</w>', 'loo', 'ally</w>', 'don’t</w>', 'from</w>', 'fin', 'as</w>', 'sp', 'You</w>', '"W', 'ess</w>', 'fa', 'ther</w>', 'what</w>', 'when</w>', 'tion</w>', 'really</w>', 'My</w>', 'no</w>', 'ck', 'ey</w>', 'id</w>', 'ever</w>', 'nd</w>', 'mu', 'ould</w>', '..</w>', 'of', 'pe', 'amp', 'gu', 'ers</w>', 'cu', 'ted</w>', 'too</w>', 'ay</w>', 'time</w>', 'al</w>', 'our</w>', 'con', '&amp', 'th</w>', 'will</w>', 'how</w>', '\"S', 'see</w>', 'ba', 'sti', 'shit</w>', 'Lo', 'oron', 'Thank</w>', 'vir', 'com', 'de', 'gi', 'tt', 'end</w>', 'pro', 'na', 'ear</w>', '&amp;</w>', 'need</w>', 'every', 'thin', 'gh</w>', 'some', 'ow</w>', 'want</w>', 'for', 'good</w>', 'more</w>', 'ru', 'Ha', '…\",Positive</w>', 'dn', 'some</w>', 'ter', 'pla', 'ople</w>', 'ell', 'her</w>', 'back</w>', '🙏\",Positive</w>', 'ut</w>', 'I\'m</w>', 'pa', 'it’s</w>', 'been</w>', 'ge</w>', 'co', 'ty</w>', 'qu', 'gg', 'pr', 'per', 'du', 'It', '💕\",Positive</w>', 'jo', 'pl', 'way</w>', 'mi', 'cause</w>', 'wn</w>', '😒\",Negative</w>', 'ry</w>', 'tion', 'tu', 'still</w>', 'y’', 'ir</w>', 'going</w>', 'ong</w>', 'ine</w>', 'hat', 'TH', 'that', 'fe', 'happ', 'people</w>', 'am</w>', 'ese</w>', '😁\",Positive</w>', 'even</w>', 'fe</w>', 'here</w>', '20', 'them</w>', 'vi', 'fri', 'virus</w>', 'by</w>', 'much</w>', 'mis', 'te', 'eep</w>', 'than', 'ver</w>', 'ely</w>', 'bab', 'end', 'ure</w>', 'any', 'ving</w>', 'man</w>', 'ollo', 'lease</w>', 'har', 'ful</w>', 'his</w>', '\"A', 'man', 'pe</w>', 'she</w>', 'think</w>', 'URL</w>', 'all', 'sed</w>', 'get', 's.</w>', 'sel', 'ning</w>', '😘\",Positive</w>', 'ways</w>', 'sc', 'had</w>', 'mb', 'Go', 'only</w>', 'IN', 'mon', 'thou', 'has</w>', 'e.</w>', 'min', 'OO', 'canc', 'can’t</w>', 'ad', 'bi', 'star', 'would</w>', 'ass</w>', 'y.</w>', 'son</w>', 'ice</w>', '😌\",Positive</w>', 'make</w>', 'br', '!!', 'he', 'gon', 'work</w>', 'lit', 'come</w>', 'right</w>', '\"C', 'par', 'who</w>', 'gir', 'im', 'wat', 'ent', 'and', 'ain', 'new</w>', 'why</w>', 'gra', 'fee', 'ed', 'lu', 'ready</w>', 'ide', 'fir', '💯\",Positive</w>', 'bea', 'gonna</w>', 'him</w>', 'll', '❤\",Positive</w>', '😔\",Positive</w>', 'coron', 'said</w>', 'hea', 'bet', 'sho', 'Ma', 'y’all</w>', 'ous</w>', 'up', 'these</w>', 'ool</w>', 'ss</w>', 'fi', '\"O', '"L', '"I', 'af', 'mor', 'ny</w>', '\"B', 'never</w>', 'res', 'We</w>', 'bl', 'Wh', 'weet</w>', '\"This</w>', 'sto', 'ng', 'now', '’re</w>', 'we', 'No', 'off</w>', 'say</w>', 'did</w>', 'ound</w>', 'oon</w>', 'take</w>', 'tal', 'uti', 'ere', 'aa', 'ook</w>', 'always</w>', '\"My</w>', '…\",Negative</w>', 'so', 'ci', 'wanna</w>', 'der</w>', 'ans</w>', 'sing</w>', 'coun', 'AN', 'im</w>', 'look</w>', 'body</w>', '\"H', '\"T', '😩\",Positive</w>', 'You', '!!!</w>', 'feel</w>', 'fun', '...', 'der', 'other</w>', 'ate</w>', 'ite</w>', 'ff', 'follo', 'there</w>', 'ge', 'eri', 'clo', 'today</w>', 'day', 'ish</w>', 'mp', 'sch', 'self</w>', 'ked</w>', 'tta</w>', 'i’', 'ght', 'Li', '@user', 'aga', 'ss', 'eli', '#S', '\"I’m</w>', 'over</w>', 'dn’t</w>', 'getting</w>', 'because</w>', 'ace</w>', '\'re</w>', '😍\",Negative</w>', '\"D', 'bit', '\"M', 'ut', 'It’s</w>', 'hope</w>', 'Thanks</w>', 'thank</w>', 'hel', 'reat</w>', 'tri', 'ic</w>', 'Just</w>', 'better</w>', 'best</w>', 'down</w>', 'They</w>', 'being</w>', 'hu', 'No</w>', 'est', 'first</w>', 'el</w>', 'mao</w>', 'cr', 'kes</w>', 'who', 'xt</w>', 'lol</w>', 'ain’t</w>', 'then</w>', 'Good</w>', 'RE', 'hear', '20</w>', 'ma</w>', 'gr', 'ill', 'dis', 'very</w>', 'utiful</w>', 'than</w>', 'please</w>', 'last</w>', 'home</w>', 'their</w>', 'HA', 'miss</w>', 'ding</w>', 'brea', 'And</w>', 'ce', 'our', 'pri', 'won', 'ight</w>', '\"i</w>', 'war', 'ON', 'oo</w>', 'mes</w>', 'ack', 'ings</w>', 'well</w>', 'cking</w>', 'ity</w>', 'So</w>', 'don\'t</w>', 'pic', '#B', 'Happ', 'mar', 'dam', 'ough</w>', 'Love</w>', 'tra', '#C', 'that’s</w>', 'next</w>', 'cla', 'same</w>', 'hate</w>', '\"F', 'bro', 'app', 'most</w>', 'AL', 'irth', 'vide', '\"The</w>', 'hh', 'fuck</w>', 'girl</w>', 'd.</w>', 'oun', 'n’t</w>', 'out', 'ect</w>', '@user\",Positive</w>', '??</w>', 'witter</w>', '\"Y', 'ay', 'where</w>', 'ke', '😌\",Negative</w>', 'sor', 'It</w>', 'should</w>', 'tho', 'already</w>', 'oul', 'its</w>', 'ree</w>', 'tw', 'wait</w>', 'fore</w>', 'ant</w>', 'whi', 'sh</w>', '.\",Negative</w>', 'life</w>', 'car', 'lov', 'happy</w>', 'son', 'sl', 'i’m</w>', 'bad</w>', 'made</w>', 'cra', 'tle</w>', 'baby</w>', 'ly', 'year</w>', 'my', 'LO', 'sha', 'stu', 'avirus</w>', 'supp', 'could</w>', '😁\",Negative</w>', 'hat’s</w>', 'ms</w>', 'thought</w>', 'tru', 'night</w>', 'oooo', 'Al', 'nee', '😏\",Positive</w>', '💯\",Negative</w>', 'ends</w>', 'han', 'ble</w>', 's!</w>', 'doing</w>', 'tur', 'school</w>', 'after</w>', 'ps</w>', 'before</w>', 'ey', '10', 'keep</w>', 'In', 'dea', 'Lol</w>', 'were</w>', 'real</w>', 'What</w>', 'cute</w>', 'off', 'any</w>', 'On', 'kin', 'ur</w>', 'ching</w>', 'vo', '\"Wh', 'row</w>', 'damn</w>', 'nu', 'gas</w>', '\"P', 'it\'s</w>', 'I’ll</w>', 'stop</w>', 'ft</w>', 'erally</w>', '....</w>', 'sta', 'irthday</w>', 'ment</w>', 'beautiful</w>', 'Don', 'this', 'give</w>', 'ph', 'sw', 'everyone</w>', 'sure</w>', 'ING</w>', 'let</w>', 'watch</w>', 'gotta</w>', 'But</w>', 'Happy</w>', 'someone</w>', 'He</w>', 'ER', 'chan', 'ha</w>', 'Oh</w>', 'ig', 'done</w>', 'ill</w>', 'every</w>', 'tell</w>', 'gga</w>', 'That</w>', 'pre', 'morning</w>', 'dr', 'ama', 'lau', 'IS</w>', 'LI', 'actu', 'whole</w>', 'ls</w>', 'tom', 'per</w>', 'ents</w>', 'eck</w>', 'mm', 'tions</w>', 'ya</w>', 'I’ve</w>', 'ws</w>', 'stay</w>', 'ther', 'days</w>', 'AS', 'eah</w>', 'shi', 'tea', 'ok', 'funny</w>', '👌\",Positive</w>', 'something</w>', 'too', 'mber</w>', '😊\",Negative</w>', 'If</w>', 'again</w>', 'year', 'pu', '\"N', 'week</w>', 'YO', '😏\",Negative</w>', 'sea', 'corona</w>', '2020</w>', 'Ch', 'everything</w>', 'Not</w>', 'try</w>', 'tf</w>', 'EE', 'friend</w>', 'dd', 've', 'US', 'It\'s</w>', 'able</w>', 'bro</w>', 'God</w>', 'col', 'sm', 'see', 'sin', 'etty</w>', 'ous', 'read</w>', 'boo', 'feel', 'fucking</w>', 'didn’t</w>', 'seri', 'into</w>', 'ves</w>', 't.</w>', '\"G', 'ort</w>', 'ag', 'old</w>', 'you’re</w>', 'sk', 'play</w>', 'cha', 'thr', 'mea', 'yy', 'cancell', 'little</w>', 'tho</w>', 'start</w>', 'rel', 'rn</w>', 'wr', 'literally</w>', 'NO', 'looking</w>', 'act', 'da</w>', 'actually</w>', 'il</w>', 'bitch</w>', 'safe</w>', 'MA', 'week', 'count</w>', 'wish</w>', 'Mar', 'til</w>', 'one', '....', 'tweet</w>', 'video</w>', 'ess', 'Sa', 'To', 'line</w>', 'hard</w>', 'aw', 'help</w>', 'ation</w>', 'great</w>', 'can\'t</w>', 'ink</w>', 'ood', 'str', 'des', 'world</w>', 'Coron', 'follow</w>', 'fli', 'times</w>', 'sorry</w>', 'nigga</w>', 'zy</w>', '!\",Positive</w>', 'friends</w>', 'Please</w>', 'while</w>', 'hit</w>', '\"E', 'gs</w>', 'ily</w>', 'ton', 'VE</w>', 'ty', 'birthday</w>', 'side</w>', '.\",Positive</w>', 'blo', 'play', 'with', 'ded</w>', 'An', 'put</w>', 'tomor', 'ap', 'ER</w>', 'cked</w>', 'know', 'sur', 'ited</w>', 'happen', 'beli', 'trying</w>', 'also</w>', 'act</w>', 'ST', 'fav', 'having</w>', 'cancelled</w>', 'ing.</w>', 'gone</w>', 'many</w>', 'zing</w>', 'let', 'long</w>', 'call', 'big</w>', 'those</w>', 'dra', 'coming</w>', 'Su', 'Me</w>', 'find</w>', '👏\",Positive</w>', 'cor', 'follow', 'finit', 'ster</w>', '❤️</w>', 'sion</w>', 'ong', 'care</w>', 'inter', 'ee</w>', 'pping</w>', 'try', 'ooo</w>', 'AR', 'LE', 'it.</w>', 'Your</w>', 'nig', 'mes', 'sad</w>', 'coronavirus</w>', 'THE</w>', 'since</w>', 'Let', 'does', 'ned</w>', 'ick', 'guys</w>', 'mag', 'ence</w>', 'looks</w>', 'How</w>', 'soon</w>', 'ven', 'show</w>', 'me.</w>', 'pra', 'ani', 'eci', 'boy</w>', 'kid']
    success = train_test(jwt_token=jwt, file_path=file, name=tokeniser_name, subword_count=subword_size, user_id=id, training_file=training_corpus, expected_tokens=expected_tokens)
    print(f"Test 2: {success}")

run_all_training_tests()