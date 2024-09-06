import os
# from flask import request
# from flask_restful import Resource
# from werkzeug.security import secure_filename
# from flask_jwt_extended import jwt_required, get_jwt_identity
from collections import defaultdict
from collections import Counter
import os
import time, copy, sys, re

class BPETraining():
    def __init__(self):
        """Initialise the BPE object."""
        self.filename = sys.argv[3]
        self.vocab_size = int(sys.argv[2])
        self.word_freq = Counter()
        self.letters = Counter()
        self.sorted_letter_freq = Counter()
        self.pair_freq = defaultdict(int)
        self.big_pair_freq = {}
        self.grouped_pairs = defaultdict(lambda: defaultdict(int))
        self.vocab = []
        self.html = '<html><body>'

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

        strip_chars = '\r\n'
        split_char = ' '

        with open(self.filename, "r", encoding="utf-8") as f:
            line = f.readline()
            while line:
                #Remove special characters and split into words with corresponding word frequency
                for word in line.strip(strip_chars).split(split_char):
                    if word:
                        self.word_freq[word] += 1
                line = f.readline()

        #Create a dictionary of letters with their frequency arranged from highest to lowest frequency
        self.sorted_letter_freq = sorted([(tuple(word[:-1]) + (word[-1]+'</w>',), freq) for word, freq in self.word_freq.items()], key=lambda x: x[1], reverse=True)
        self.delete_file()

    def find_initial_pair_freq(self):
        """Iterate through each word, iterate through each letter in that word to create pairs to add to pair_freq and grouped_pairs"""
        for i, (letters, freq) in enumerate(self.sorted_letter_freq):
            prev_char = letters[0]
            for char in letters[1:]:
                pair = (prev_char, char)
                self.pair_freq[pair] += freq
                self.grouped_pairs[pair][i] += 1
                prev_char = char


    def merge_pair(self, most_frequent_pair):
        """Merge the most frequent pair and update the pair_freq and grouped_pairs"""
        #Merge pair and add merged pair as a new vocabulary item
        merged_string = most_frequent_pair[0] + most_frequent_pair[1]
        self.vocab.append(merged_string)

        #Create a pattern for merging the word tuple
        merged_string = merged_string.replace('\\', '\\\\')
        split_char = ' '
        pattern = re.compile(r'(?<!\S)' + re.escape(most_frequent_pair[0] + split_char + most_frequent_pair[1]) + r'(?!\S)')   
        changes = []
        #Iterate through words effected by pair and merge pair in tuples
        for index, freq in self.grouped_pairs[most_frequent_pair].items():
            if freq < 1:
                continue
            letters, freq = self.sorted_letter_freq[index]
            new_letters = split_char.join(letters)
            new_letters = pattern.sub(merged_string, new_letters)
            new_letters = tuple(new_letters.split(split_char))
            self.sorted_letter_freq[index] = (new_letters, freq)
            changes.append((index, new_letters, letters, freq))

        self.pair_freq[most_frequent_pair] = 0
        #Update grouped_pairs and pair_freq based on the changes made to the tuples for all the words
        for idx, new_letters, letters, freq in changes:
            i = 0
            #find the index of the pair in the tuple
            while True:
                try:
                    i = letters.index(most_frequent_pair[0], i)
                except ValueError:
                    break
                
                # remove pairs that included the most frequent pairs individual items
                if i < len(letters) - 1 and letters[i+1] == most_frequent_pair[1]:
                    # eg. remove (a, b) and (c, d) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c)
                    if i:
                        before_pair = letters[i-1:i+1]
                        self.pair_freq[before_pair] -= freq
                        self.grouped_pairs[before_pair][idx] -= 1
                    if i < len(letters) - 2:
                        if letters[i+2] != most_frequent_pair[0] or i >= len(letters) - 3 or letters[i+3] != most_frequent_pair[1]:
                            after_pair = letters[i+1:i+3]
                            self.pair_freq[after_pair] -= freq
                            self.grouped_pairs[after_pair][idx] -= 1
                    i += 2
                else:
                    i += 1
            i = 0
            #find the index of the pair in the newly merged tuple
            while True:
                try:
                    i = new_letters.index(merged_string, i)
                except ValueError:
                    break
                # add new pairs that included the most frequent pairs as elements
                if i:
                    # eg. ad (a, bc) and (bc, d) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c)
                    new_before_pair = new_letters[i-1:i+1]
                    self.pair_freq[new_before_pair] += freq
                    self.grouped_pairs[new_before_pair][idx] += 1
                if i < len(new_letters) - 1 and new_letters[i+1] != merged_string:
                    new_after_pair = new_letters[i:i+2]
                    self.pair_freq[new_after_pair] += freq
                    self.grouped_pairs[new_after_pair][idx] += 1
                i += 1

    def prune_stats(self, threshold):
        """Remove pairs with frequency below threshold and add to big_pair_freq"""
        for item, freq in list(self.pair_freq.items()):
            if freq < threshold:
                del self.pair_freq[item]
                if freq < 0:
                    self.big_pair_freq[item] += freq
                else:
                    self.big_pair_freq[item] = freq

    def train(self):
        """Train the BPE model"""

        self.find_initial_pair_freq()
        self.big_pair_freq = copy.deepcopy(self.pair_freq)
        
        min_freq = 2
        threshold = max(self.pair_freq.values()) / 10
        #print(f"Threshold: {threshold}")
        
        for i in range(self.vocab_size):
            #continuously update the pair_freq and big_pair_freq dictionaries if the pair_freq is empty or the most frequent pair is below the threshold
            if self.pair_freq:
                most_frequent_pair = max(self.pair_freq, key=lambda x: (self.pair_freq[x], x))
            if not self.pair_freq or (i and self.pair_freq[most_frequent_pair] < threshold):
                self.prune_stats(threshold)
                self.pair_freq = copy.deepcopy(self.big_pair_freq)
                most_frequent_pair = max(self.pair_freq, key=lambda x: (self.pair_freq[x], x))
                threshold = self.pair_freq[most_frequent_pair] * i/(i+10000.0)
                self.prune_stats(threshold)
            if self.pair_freq[most_frequent_pair] < min_freq:
                break

            self.merge_pair(most_frequent_pair)
            #print(f"pair {len(self.vocab)}: {most_frequent_pair}")
            self.pair_freq[most_frequent_pair] = 0
            
            if not i % 100:
                self.prune_stats(threshold)

    def main(self):
        """"Main function to train the BPE model"""
        tokenizer_id = sys.argv[1]
        
        start_time = time.perf_counter()
        self.open_file()
        self.train()
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        #print(f"Elapsed Time: {elapsed_time:.6f} seconds")

        import requests

        BASE = "http://127.0.0.1:5000/"

        response = requests.post(BASE + "api/tokenizer/complete", json={"_id": tokenizer_id, "training_time": elapsed_time, "tokens": self.vocab}).text
        self.delete_file()
        # print(response)
        # return  self.vocab
    
if __name__ == "__main__":
    print("Starting BPE Training...")
    bpe = BPETraining()
    bpe.main()