"""
BPE algorithm for reading a training corpus textfile consisting of words, generating all the posible pair combinations and iteratively finding the most frequently occuring pairs to add to the 
vocabulary. Sections of this code was adapted from the following source:

Reference:
Rico Sennrich, Barry Haddow and Alexandra Birch (2016). Neural Machine Translation of Rare Words with Subword Units.
Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (ACL 2016). Berlin, Germany.
"""
import os, time, copy, sys, re, requests
from collections import defaultdict
from collections import Counter

class BPETraining():
    def __init__(self):
        """Initialise the BPE object."""
        self.filename = sys.argv[3]                                 # string
        self.vocab_size = int(sys.argv[2])                          # int
        self.word_freq = Counter()                                  # word:frequency
        self.sorted_word_freq = Counter()                           # {letter tuple: word frequency}
        self.pair_freq = defaultdict(int)                           # {pair:frequency} (only pairs with a frequency above the threshold)
        self.big_pair_freq = {}                                     # {pair: frequency} (all the pairs)
        self.grouped_pairs = defaultdict(lambda: defaultdict(int))  # {pair: (word index:word frequency)}
        self.vocab = []                                             # list(str)
        self.html = '<html><body>'                                  # for json output

    def delete_file(self):
        """Delete the file saved to the given filepath."""
        file_path = os.path.join(self.filename) 
        # only delete file if the file exists, otherwise desplay error
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
            # read file line by line
            while line:
                # remove special characters in line and split line into words with corresponding word frequency
                for word in line.strip(strip_chars).split(split_char):
                    if word:
                        # increment words frequency by 1
                        self.word_freq[word] += 1
                line = f.readline()

        # create a dictionary of a word divided into a tuple of letters as the key and the frequency as the value arranged from highest to lowest frequency
        self.sorted_word_freq = sorted([(tuple(word[:-1]) + (word[-1]+'</w>',), freq) for word, freq in self.word_freq.items()], key=lambda x: x[1], reverse=True)


    def find_initial_pair_freq(self):
        """Iterate through each word, iterate through each letter in that word to create pairs to add to pair_freq and grouped_pairs"""
        for i, (letters, freq) in enumerate(self.sorted_word_freq):
            # iterate through all the words in sorted_word_freq (words are unique)
            prev_char = letters[0]
            for char in letters[1:]:
                # iterate through all the letters in each word to generate pairs
                pair = (prev_char, char)
                self.pair_freq[pair] += freq
                self.grouped_pairs[pair][i] += 1
                prev_char = char

    def merge_pair(self, most_frequent_pair):
        """Merge the most frequent pair and update the pair_freq and grouped_pairs"""
        # merge pair and add merged pair as a new vocabulary item
        merged_string = most_frequent_pair[0] + most_frequent_pair[1]
        self.vocab.append(merged_string)

        # create a pattern for merging the word tuple
        merged_string = merged_string.replace('\\', '\\\\')
        split_char = ' '
        pattern = re.compile(r'(?<!\S)' + re.escape(most_frequent_pair[0] + split_char + most_frequent_pair[1]) + r'(?!\S)')   
        changes = []
        # iterate through words effected by most_frequent_pair and merge that pair in all the words tuples
        for index, freq in self.grouped_pairs[most_frequent_pair].items():
            if freq < 1:
                continue
            letters, freq = self.sorted_word_freq[index]                # get all tuples of letters and frequency of that word
            new_letters = split_char.join(letters)                      # join the letters in the tuple
            new_letters = pattern.sub(merged_string, new_letters)       # merge pair in tuple based on pattern
            new_letters = tuple(new_letters.split(split_char))          # generate new tuple
            self.sorted_word_freq[index] = (new_letters, freq)          # get word frequency
            changes.append((index, new_letters, letters, freq))         # add it to the list of updates needed to make in pair_freq and grouped_pairs 

        self.pair_freq[most_frequent_pair] = 0
        # iterate through the list of changes made and update grouped_pairs and pair_freq 
        for idx, new_letters, letters, freq in changes:
            i = 0
            # find the index of the pair in the tuple
            while True:
                try:
                    i = letters.index(most_frequent_pair[0], i)
                except ValueError:
                    break
                
                # remove pairs that included the most frequent pairs individual items
                if i < len(letters) - 1 and letters[i+1] == most_frequent_pair[1]:
                    # eg. remove (a, b) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c)
                    if i:
                        before_pair = letters[i-1:i+1]
                        self.pair_freq[before_pair] -= freq
                        self.grouped_pairs[before_pair][idx] -= 1
                    if i < len(letters) - 2:
                        # eg. remove (c, d) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c) ONLY IF there is an element after the merged pair
                        if letters[i+2] != most_frequent_pair[0] or i >= len(letters) - 3 or letters[i+3] != most_frequent_pair[1]:
                            after_pair = letters[i+1:i+3]
                            self.pair_freq[after_pair] -= freq
                            self.grouped_pairs[after_pair][idx] -= 1
                    i += 2
                else:
                    i += 1
            i = 0
            # find the index of the pair in the newly merged tuple
            while True:
                try:
                    i = new_letters.index(merged_string, i)
                except ValueError:
                    break
                # add new pairs that included the most frequent pairs as elements
                if i:
                    # eg. add (a, bc) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c) ONLY IF there is an element before the merged pair
                    new_before_pair = new_letters[i-1:i+1]
                    self.pair_freq[new_before_pair] += freq
                    self.grouped_pairs[new_before_pair][idx] += 1
                if i < len(new_letters) - 1 and new_letters[i+1] != merged_string:
                    # add (bc, d) if the original tuple was (a, b, c, d) and the most_frequent_pair was (b, c) ONLY IF there is an element after the merged pair
                    new_after_pair = new_letters[i:i+2]
                    self.pair_freq[new_after_pair] += freq
                    self.grouped_pairs[new_after_pair][idx] += 1
                i += 1

    def prune_stats(self, threshold):
        """Remove pairs with frequency below threshold and add to big_pair_freq"""
        for item, freq in list(self.pair_freq.items()):
            # iterate through all the pairs in pair_freq
            if freq < threshold:
                # if the pair has a frequency below the threshold, remove it from pair_freq and add it to big_pair_freq
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
        
        for i in range(self.vocab_size):
            # keep running the process until the vocab_size is reached or the most frequent pair is below the threshold
            if self.pair_freq:
                # get most frequent pair if there are pairs in pair_freq
                most_frequent_pair = max(self.pair_freq, key=lambda x: (self.pair_freq[x], x))
            if not self.pair_freq or (i and self.pair_freq[most_frequent_pair] < threshold):
                # if pair_freq is empty or the most frequent pair is below the threshold update the threshold and prune the pair_freq
                self.prune_stats(threshold)
                self.pair_freq = copy.deepcopy(self.big_pair_freq)
                most_frequent_pair = max(self.pair_freq, key=lambda x: (self.pair_freq[x], x))
                threshold = self.pair_freq[most_frequent_pair] * i/(i+10000.0)
                self.prune_stats(threshold)
            if self.pair_freq[most_frequent_pair] < min_freq:
                # if there are no more pairs with a frequency above the threshold, break the loop
                break
            
            # merge most frequent pair
            self.merge_pair(most_frequent_pair)
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
        # print(f"Elapsed Time: {elapsed_time:.6f} seconds")

        BASE = "http://127.0.0.1:5000/"

        response = requests.post(BASE + "api/tokenizer/complete", json={"_id": tokenizer_id, "training_time": elapsed_time, "tokens": self.vocab}).text
        self.delete_file()
    
if __name__ == "__main__":
    print("Starting BPE Training...")
    bpe = BPETraining()
    bpe.main()