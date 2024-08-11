import requests

BASE = "http://127.0.0.1:5000/"

response = requests.post(BASE + "api/user/register", json={"username": "conor", "email": "conor@conor", "password": "really bad password"})
print(response.json())