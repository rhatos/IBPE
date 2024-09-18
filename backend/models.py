from passlib.hash import pbkdf2_sha256

class User():
  """
    A class used to represent a registered user.

    Password is encrypted with sha256 hash.
  """
  def __init__(self, username, email, password):
    self.username = username
    self.email = email
    self.password = pbkdf2_sha256.hash(password)
    self.models_trained=[]
    self.tokenized_texts=[]
  
  def getObject(self):
    """
      Returns a json object of a user's attributes.
    """
    return {
      "username": self.username,
      "email": self.email,
      "password": self.password,
      "models": self.models_trained,
      "tokenized_texts": self.tokenized_texts
    }

class Tokenizer():
  """
    A class used to represent a trained/to be trained tokenizer model.
  """
  def __init__(self, name, subword_vocab_count, user_id, training_file):
    self.name = name
    self.subword_vocab_count = subword_vocab_count
    self.tokens = []
    self.user_id = user_id
    self.trained = False
    self.training_file = training_file
    self.training_time = 0
  
  def getObject(self):
    """
      Returns a json object of the model's attributes.
    """
    return {
      "name": self.name,
      "subword_vocab_count": self.subword_vocab_count,
      "trained": self.trained,
      "user_id": self.user_id,
      "training_time": self.training_time,
      "training_file": self.training_file,
      "tokens": self.tokens
    }

class TokenizedText():
  """
    A class used to represent a tokenized text.
  """
  def __init__(self, name, tokenizer_id, input_text, input_file, user_id):
    self.name = name
    self.tokenizer_id = tokenizer_id
    self.input_text = input_text
    self.input_file = input_file
    self.user_id = user_id
    self.tokenized_text = ""
    self.output_file = ""
    self.tokenization_time = 0
  
  def getObject(self):
    """
      Returns a json object of the tokenized text object's attributes.
    """
    return {
      "name": self.name,
      "user_id": self.user_id,
      "tokenizer_id": self.tokenizer_id,
      "tokenization_time": self.tokenization_time,
      "tokenized_text": self.tokenized_text,
      "input_text": self.input_text,
      "input_file": self.input_file,
      "output_file": self.output_file,
      "tokenized": False,
      "statistics": None
    }