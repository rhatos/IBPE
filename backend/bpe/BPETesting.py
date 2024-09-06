from collections import defaultdict
import multiprocessing
import time
import json
import sys
import requests
import os

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
        self.lock = multiprocessing.Manager().Lock()
        self.words = defaultdict(list)
        self.colours = ["#970c10", "#c40c0c", "#e02401", "#d2001a", "#c63d2f", "#e25e3e", "#f76e11", "#f88f01", "#f7a440", "#ffbb5c", "#ffd88a", "#c9dabf", "#9ca986", "#739072", "#808d7c", "#5f6f65", "#4f6f52", "#166088", "#345e7d", "#6482ad", "#7fa1c3", "#a2c4e0", "#c0d6df", "#dbe9ee"]
        self.vocabulary_used = set()
        self.token_count = 0
        self.word_count = 0

    def process_input(self):
        self.input_type = sys.argv[2]
        if self.input_type == "file":
            self.filename = sys.argv[3]
            self.open_file()
        else:
            self.text_input = sys.argv[3]
            self.process_text()
        self.vocab = set(sys.argv[4])

    def delete_file(self):
        """Delete the file saved to the given filepath."""
        file_path = os.path.join(self.filename) 

        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File deleted successfully: {file_path}")
        else:
            print(f"File not found: {file_path}")

    def open_file(self):
        """Open file and split corpus into words"""
        split_char = ' '
        i = 0
        with open(self.filename, "r", encoding="utf-8") as file:
            line = file.readline()
            while line:
                #Remove special characters and split into words with corresponding word frequency
                for word in line.split(split_char):
                    if word:
                        self.words[word].append(i)
                    i += 1
                line = file.readline()
        self.tokenised_text = [None] * i
        self.html_output = [None] * i
        self.word_count = i
        self.delete_file()

    def process_text(self):
        """Process text input and split into words"""
        split_char = ' '
        i = 0
        for word in self.text_input.split(split_char):
            if word:
                self.words[word].append(i)
            i += 1
        self.tokenised_text = [None] * i
        self.html_output = [None] * i
        self.word_count = i

    def find_combination(self, combinations, vocabulary):
        max_length = 0
        largest_combinations = []

        # Iterate through the word character by character
        for combination in combinations:
            current_sequence = combination[0]
            # Check if the current sequence exists in the vocabulary
            if current_sequence in vocabulary:
                if len(current_sequence) > max_length:
                    max_length = len(current_sequence)
                    largest_combinations.clear()
                    largest_combinations.append(combination)
                elif len(current_sequence) == max_length:
                    largest_combinations.append(combination)

        return largest_combinations


    def recursive_algorithm(self, vocabulary, word):
        # Base case: Empty word
        if len(word) == 0:
            return []

        # Split word into combinations
        combinations = []
        for i in range(len(word)):
            for j in range(i + 1, len(word) + 1):
                current_sequence = word[i:j]
                combinations.append((current_sequence, i, j))

        largest_combinations = self.find_combination(combinations, vocabulary)
        
        # Base case: No valid combination found
        if not largest_combinations:
            return list(word)

        # Base case: Complete match
        if largest_combinations[0][0] == word:
            return [word]

        found_combination = largest_combinations[0][0]
        start_idx = largest_combinations[0][1]
        end_idx = largest_combinations[0][2]

        # Recursively call the function with both left and right branches
        array1 = self.recursive_algorithm(vocabulary, word[:start_idx])
        array2 = [found_combination]
        array3 = self.recursive_algorithm(vocabulary, word[end_idx:])
        return array1 + array2 + array3
    
    def write_to_file(self):
        #determine change filepath
        "bpe/uploads/testTokenizerFiles/userID_filename_1"
        self.output_file = self.filename[:4] + "outputs" + self.filename[30:]
        with open(self.output_filename+"tokenised_text", "w", encoding="utf-8") as file:
            file.write(" ".join(self.tokenised_text))

    def create_json_from_html_output(self):
        # Create the HTML content by joining all tokens
        html_content = "".join([token for word_tokens in self.html_output for token in word_tokens])

        # Create the dictionary representing our JSON structure
        json_object = {
            'html_body': html_content.strip()
        }

        return json_object
    
    def process_statistics(self):
        """Use the token_count and vocabulary_used to calculate statistics and update the statistics object"""
        no_tokens = len(set(self.vocabulary_used))
        ratio = self.token_count / self.word_count
        percentage = len(self.vocabulary_used) / len(self.vocab)
        json_object = {
            "statistics": {
                "no_tokens": no_tokens,
                "ratio": ratio,
                "percentage": percentage,
                "vocabulary_used": list(self.vocabulary_used)
            }
        }
        return json_object

    def train(self):
        """Train BPE tokenizer on corpus by running the recursive function on each word."""
        k = 0
        for word in self.words.keys():
            tokenised_word = self.recursive_algorithm(self.vocab, word)
            formatted_word = "_".join(tokenised_word).strip('_')
            #html output formatting
            for i in range(len(tokenised_word)):
                #if tokenised_word[i] in self.vocab:
                if k >= 24:
                    k = 0
                if tokenised_word[i] not in self.vocabulary_used and tokenised_word[i].lower() in self.vocab:
                    self.vocabulary_used.add(tokenised_word[i])
                tokenised_word[i] = f"<span style='color:{self.colours[k]}'>{tokenised_word[i]}</span>"
                k += 1
                
            for i in self.words[word]:
                self.tokenised_text[i] = formatted_word
                self.html_output[i] = tokenised_word

    def main(self):
        """Main function to run BPE tokenizer."""
        test_id = sys.argv[1]
        start_time = time.perf_counter()
        self.process_input()
        self.train()
        statistics_json = self.process_statistics()
        self.write_to_file()
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        print(f"Elapsed Time: {elapsed_time:.6f} seconds")
        BASE = "http://127.0.0.1:5000/"
        if self.input_type == "text":
            html_json = self.create_json_from_html_output()
            response = requests.post(BASE + "api/tokenizer/complete", json={"_id": test_id, "tokenization_time": elapsed_time, "tokenized_text": html_json, "statistics": statistics_json}).text
        else:
            response = requests.post(BASE + "api/tokenizer/complete", json={"_id": test_id, "tokenization_time": elapsed_time, "output_file": self.output_filename, "statistics": statistics_json}).text

if __name__ == "__main__":
    print("Starting BPE Testing...")
    bpe = BPETesting()
    bpe.main()