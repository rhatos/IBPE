"""
    Testing algorithm reads in either a textfile or text input for a user and divides the text into tokens existsing in the given tokenisers voabulary.
"""

from collections import defaultdict
import time, sys, requests, os

class BPETesting:
    def __init__(self):
        self.input_type = ""
        self.filename = ""
        self.output_filename = ""
        self.text_input = ""
        self.vocab = set()
        self.text = ""
        self.tokenised_text = []
        self.html_output = []
        self.words = defaultdict(list)          # {word: index of word in file}
        self.colours = ["#D04848", "#ED9455", '#5F6F65',"#6482AD", "624E88"]
        self.vocabulary_used = set()
        self.token_count = 0
        self.word_count = 0
        self.character_count = 0
        self.num_spaces = 0

    def process_input(self):
        """Process the input arguments"""
        self.input_type = sys.argv[2]
        if self.input_type == "file":
            # if the input type is a file then set the filename and open the file
            self.filename = sys.argv[3]
            self.open_file()
        else:
            # if the input type is a text then set the text input and process the text
            self.text_input = sys.argv[3].encode('utf-8').decode('utf-8')
            self.character_count = len(self.text_input)
            self.process_text()
        self.vocab = set(sys.argv[5:])
       
    def delete_file(self):
        """Delete the file saved to the given filepath."""
        file_path = os.path.join(self.filename) 
        # only delete the file if the file exists, otherwise desplay an error
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File deleted successfully: {file_path}")
        else:
            print(f"File not found: {file_path}")

    def open_file(self):
        """Open file and split corpus into words"""
        spaces = True       #while there are leading or trailing spaces, it's true
        strip_chars = '\r\n'
        split_char = ' '
        line_num = 0
        i = 0  # index of word in file
        with open(self.filename, "r", encoding="utf-8") as file:
            lines = file.readlines()  # Read all lines at once
            self.character_count = sum(len(line) for line in lines)  # Calculate character count
            
            for line in lines:
                # Trim leading and trailing whitespace from the line
                line = line.strip()
                
                if not line:  # Skip empty lines
                    continue
                
                if line_num == 0:
                    # Remove all the spaces in the front of the file
                    while spaces:
                        if line.startswith(' '):
                            line = line[1:]
                        else:
                            spaces = False

                # remove special characters and split into words with corresponding word frequency
                for word in line.strip(strip_chars).split(split_char):
                    if word == ' ':
                        self.num_spaces += 1
                    if word:
                        # add a word to the dictionary, including the word's index in the file
                        self.words[word].append(i)
                    i += 1
                line_num += 1
                
        # create empty lists to add tokenized words to the correct indexes later
        list_size = i-self.num_spaces
        self.tokenised_text = [' '] * list_size
        self.html_output = [' '] * list_size
        self.word_count = list_size

    def process_text(self):
        """Process text input and split into words"""
        # remove spaces from the front and back of the text input
        spaces = True       #while there are leading or trailing spaces, it's true
        while spaces:
            for i in range(len(self.text_input)):
                if self.text_input[0] == ' ':
                    self.text_input = self.text_input[1:]
                else:
                    spaces = False
        spaces = True
        while spaces:
            for i in range(len(self.text_input)):
                if self.text_input[len(self.text_input) - 1] == ' ':
                    self.text_input = self.text_input[:-1]
                else:
                    spaces = False
                    
        split_char = ' '
        i = 0       # index of word in file
        for word in self.text_input.split(split_char):
            if word == ' ':
                        self.num_spaces += 1
            # iterate through all the words in the text
            if word:
                # add a word to the dictionary, including the words index in the file
                self.words[word].append(i)
            i += 1
        # create empty lists to add tokenised works to the correct indexes later
        list_size = i-self.num_spaces
        self.tokenised_text = [' '] * list_size
        self.html_output = [' '] * list_size
        self.word_count = list_size

    def find_combination(self, combinations, vocabulary):
        """Find the longest combination of consecutive letters that exists in the vocabulary for a word"""
        max_length = 0
        largest_combinations = []

        # iterate through the word character by character
        for combination in combinations:
            current_sequence = combination[0]
            # check if the current sequence exists in the vocabulary
            if current_sequence in vocabulary:
                if len(current_sequence) > max_length:
                    # update largest combination if the current sequence is longer than the current largest combination
                    max_length = len(current_sequence)
                    largest_combinations.clear()
                    largest_combinations.append(combination)
                elif len(current_sequence) == max_length:
                    largest_combinations.append(combination)
        # return the largest combination of consecutive letters that exists in the vocabulary

        return largest_combinations


    def recursive_algorithm(self, vocabulary, word, original_length):
        """Recursively find the longest combination of consecutive letters that exists in the vocabulary for a word"""
        # Base case: Empty word
        if len(word) == 0:
            return []

        # split word into combinations
        combinations = []
        for i in range(len(word)):
            for j in range(i + 1, len(word) + 1):
                current_sequence = word[i:j]
                if j == (original_length):
                    current_sequence += "</w>"
                combinations.append((current_sequence, i, j))

        largest_combinations = self.find_combination(combinations, vocabulary)
        
        # base case: No valid combination found
        if not largest_combinations:
            return list(word)

        # base case: Complete match
        if largest_combinations[0][0] == word:
            return [word]

        found_combination = largest_combinations[0][0]
        start_idx = largest_combinations[0][1]
        end_idx = largest_combinations[0][2]

        # recursively call the function with both left and right branches
        array1 = self.recursive_algorithm(vocabulary, word[:start_idx], original_length)
        array2 = [found_combination]
        array3 = self.recursive_algorithm(vocabulary, word[end_idx:], original_length-end_idx)
        
        return array1 + array2 + array3
    
    def write_to_file(self):
        """Writing the tokenised text to an output file"""
        # Write output to output folder with epoch time attached for auto deletion later
        file_creation_time = int(time.time())
        self.output_file = "bpe/outputs/testing/"+str(file_creation_time)+"_tokenized_"+self.filename.split("/")[3] 
        with open(self.output_file, "w", encoding="utf-8") as file:
            file.write(" ".join(self.tokenised_text))

    def create_json_from_html_output(self):
        """Converting the html_output to a JSON object"""
        # create the HTML content by joining all tokens
        html_content = "".join([token for word_tokens in self.html_output for token in word_tokens])
        
        print(self.html_output)



        # create the dictionary representing our JSON structure
        json_object = {
            'html_body': html_content.strip()
        }

        return json_object
    
    def process_statistics(self):
        """Use the token_count and vocabulary_used to calculate statistics and update the statistics object"""
        no_tokens = len(set(self.vocabulary_used)) # Number of unique tokens

        # Calculate total number of tokens displayed on the page.
        for entry in self.html_output:
            for word in entry:
                if word != ' ':
                    self.token_count += 1
        ratio = self.token_count / self.word_count
        
        percentage = len(self.vocabulary_used) / len(self.vocab)
        json_object = {
                "character_count": self.character_count,
                "no_tokens": no_tokens,
                "ratio": ratio,
                "percentage": percentage,
                "vocabulary_used": list(self.vocabulary_used)
        }
        return json_object

    def tokenise(self):
        """Train BPE tokenizer on corpus by running the recursive function on each word."""

        tokenized_word_list = []

        k = 0
        for word in self.words.keys():
            # check if the whole word is in the vocab or it needs to be broken up into tokens
            original_length = len(word)
            tokenised_word = self.recursive_algorithm(self.vocab, word, original_length)
            tokenized_word_list.append(tokenised_word)
            formatted_word = "_".join(tokenised_word).strip('_')
            if formatted_word[-4:] == "</w>":
                formatted_word = formatted_word[:-4]
            # html output formatting
            for i in range(len(tokenised_word)):
                # if tokenised_word[i] in self.vocab:
                if k >= 4:
                    k = 0
                if tokenised_word[i] not in self.vocabulary_used and tokenised_word[i] in self.vocab:
                    self.vocabulary_used.add(tokenised_word[i])
                    
                tokenised_word[i] = f"<span style='background-color:{self.colours[k]}; color:white'>{tokenised_word[i]}</span>"
                
                k += 1
                
            for i in self.words[word]:
                self.tokenised_text[i] = formatted_word
                
                tokenised_word.append(' ')
                self.html_output[i] = tokenised_word


                
    def delete_file(self):
        """Delete the file saved to the given filepath."""
        file_path = os.path.join(self.filename) 
        # Only delete file if the file exists, otherwise display error
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File deleted successfully: {file_path}")
        else:
            print(f"File not found: {file_path}")

    def main(self):
        """Main function to run BPE tokenizer."""
        test_id = sys.argv[1]
        start_time = time.perf_counter()
        self.process_input()
        self.tokenise()
        statistics_json = self.process_statistics()
        
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        print(f"Elapsed Time: {elapsed_time:.6f} seconds")
        BASE = "http://127.0.0.1:5000/"
        # return different responses based on the input type
        if self.input_type == "text":
            html_json = self.create_json_from_html_output()
            response = requests.post(BASE + "api/tokenizer-test/complete", json={"_id": test_id, "tokenization_time": elapsed_time, "tokenized_text": html_json, "statistics": statistics_json})
        else:
            self.write_to_file()
            response = requests.post(BASE + "api/tokenizer-test/complete", json={"_id": test_id, "tokenization_time": elapsed_time, "output_file": self.output_file, "statistics": statistics_json})
            self.delete_file()

if __name__ == "__main__":
    print("Starting BPE Testing...")
    bpe = BPETesting()
    bpe.main()