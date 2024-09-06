
"""
THIS IS TEMP - Just for testing purposes until actual script is finished

Reference:
Rico Sennrich, Barry Haddow and Alexandra Birch (2016). Neural Machine Translation of Rare Words with Subword Units.
Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (ACL 2016). Berlin, Germany.

https://aclanthology.org/P16-1162.pdf
https://github.com/rsennrich/subword-nmt/blob/master/subword_nmt/learn_bpe.py

"""

from collections import Counter, defaultdict
import copy
import re
import time
import sys

# Read text and return dictionary
def get_vocab(infile):
  
  # Counter counts number of occurances of a word and saves this as a dict
  vocab = Counter()

  # Remove all carriage returns and new lines
  strip_chars = '\r\n'

  # Split file by spaces
  split_char = ' '

  with open(infile, "r") as f:
    line = f.readline()
    while line:
      # For each word in the file line, remove all carriage returns and new lines, then split
      # by spaces.
      for word in line.strip(strip_chars).split(split_char):
        # If there is a word, initialize and add it to the counter
        if word:
          vocab[word] += 1
      line = f.readline()
  
  return vocab
  # End up with: Counter({'animals': 3, 'funny': 2, 'New': 1}) ... etc
  # Uncomment line below to see.
  #print(vocab)

# Count frequency of all symbol pairs and create index
def get_pair_statistics(vocab):
  stats = defaultdict(int)

  # index from pairs to words
  # Dict where default value for another key is another dict
  # So if you try and access a key that doesn't exist it will create a nested dict
  # with the int type as its keys.
  indices = defaultdict(lambda: defaultdict(int))

  # TODO:
  # Figure out what this piece does properly.
  for i, (word, freq) in enumerate(vocab):
    prev_char = word[0]
    for char in word[1:]:
      stats[prev_char, char] += freq
      indices[prev_char, char][i] += 1
      prev_char = char
  
  return stats, indices

# Prune the stats dict for efficiency of max()
def prune_stats(stats, big_stats, threshold):
  for item, freq in list(stats.items()):

    # If the frequency of the item is < than the threshold based off of Zipf's
    if freq < threshold:

      # Remove it from stats
      del stats[item]

      # If its < 0, we add it anyway to the big stats and increase its frequency by 1
      # This is so it is not ignored completely later
      if freq < 0:
        big_stats[item] += freq
      else:
        big_stats[item] = freq

# Replace all occurances of a symbol pair ('A', 'B') with 'AB'
def replace_pair(pair, vocab, indices):
  split_char = ' '
  first, second = pair

  pair_str = ''.join(pair)
  
  # More voodoo magic here withr regular expressions
  pair_str = pair_str.replace('\\', '\\\\')
  pattern = re.compile(r'(?<!\S)' + re.escape(first + split_char + second) + r'(?!\S)')
  changes = []

  iterator = indices[pair].items()

  # TODO:
  # Figure out what this does exactly
  for j, freq in iterator:
    if freq < 1:
      continue
    word, freq = vocab[j]
    new_word = split_char.join(word)
    new_word = pattern.sub(pair_str, new_word)
    new_word = tuple(new_word.split(split_char))

    vocab[j] = (new_word, freq)
    changes.append((j, new_word, word, freq))
  
  return changes

# Update the indices and frequencies of symbol pairs
# If we merge a pair of symbols, only pairs that overlap with occurances of this pair
# are affected, and need to be updated.
def update_pair_statistics(pair, changed, stats, indices):
  stats[pair] = 0
  indices[pair] = defaultdict(int)
  first, second = pair
  new_pair = first+second

  for j, word, old_word, freq in changed:
    # Find all instances of pair and update frequency/indices around(?) it
    i = 0
    while True:
      # find first symbol
      try:
        i = old_word.index(first, i)
      except ValueError:
        break

      # If first symbol is followed by second symbol, we've found an occurance
      # of pair (old_word[i:i+2])
      if i < len(old_word)-1 and old_word[i+1] == second:
        # Assuming a symbol frequency of A B C, if B C is merged, reduce the frequency of A B
        # Since it's then just A BC not A B C
        if i:
          prev = old_word[i-1:i+1]
          stats[prev] -= freq
          indices[prev][j] -= 1
        if i < len(old_word)-2:
          # Assuming symbol frequency of A B C B, if B C is merged, reduce frequency of C B
          # Skip if the sequence is A B C B C, because the freq of C B will be reduced by previous block
          if old_word[i+2] != first or i >= len(old_word)-3 or old_word[i+3] != second:
            nex = old_word[i+1:i+3]
            stats[nex] -= freq
            indices[nex][j] -= 1
        i += 2
      else:
        i += 1
    
    i = 0
    while True:
      try:
        # find new pair
        i = word.index(new_pair, i)
      except ValueError:
        break

      # Assuming symbol seq of A BC D, if B C is merged, increase the freq of A BC
      if i:
        prev = word[i-1:i+1]
        stats[prev] += freq
        indices[prev][j] += 1

      # Assuming symbol seq of A BC B, if B C is merged, increase the freq of BC B
      # Skip if A BC BC, because the count of BC BC will be incremented by previous code block
      if i < len(word)-1 and word[i+1] != new_pair:
        nex = word[i:i+2]
        stats[nex] += freq
        indices[nex][j] += 1
      i += 1

def train_bpe(infile, vocab_size, outfile, token_list):
  # Get the vocab
  vocab = get_vocab(infile)

  # Lambda voodoo magic
  # Original:
  # {
  #   ('animals'): 3,
  #   ....
  # }

  # Splits up the word into characters and tacks the </w> character onto the end,
  # while retaining the frequency of the word.
  vocab = dict([(tuple(x[:-1])+(x[-1]+'</w>',), y) for (x,y) in vocab.items()])
  # Produces:
  # {
  #   ('a', 'n', 'i', 'm', 'a', 'l', 's</w>'): 3
  # }
  
  # Takes the vocab dict and sorts it from most frequent to least frequent
  sorted_vocab = sorted(vocab.items(), key=lambda x: x[1], reverse=True)

  stats, indices = get_pair_statistics(sorted_vocab)
  big_stats = copy.deepcopy(stats)

  # The requirement for 2 words to merge
  min_frequency = 2

  # Threshold based on Zipf's Law
  # https://en.wikipedia.org/wiki/Zipf%27s_law
  # Why are we dividing by 10? i dont know!
  # I believe it is to eliminate the least common words based on probability
  # So essentially: 
  #   We create a threshold and if there are words that initially don't meet it we remove them
  #   Then we process everything
  #   And if we haven't reached our desired vocab size
  #   We then check them in big_stats
  # This whole process is in prune_stats()
  threshhold = max(stats.values()) / 10 
  print(f"Threshold: {threshhold}")

  # Compute merges until desired size
  for i in range(vocab_size):

    # If we've still got elements in stats, find the most frequent word
    if stats:
      most_frequent = max(stats, key=lambda x: (stats[x], x))
      
    # If nothing left in the stats dict then check the big stats
    if not stats or (i and stats[most_frequent] < threshhold):
      prune_stats(stats, big_stats, threshhold)

      # Turns the stats dict into big_stats
      stats = copy.deepcopy(big_stats)

      most_frequent = max(stats, key=lambda x: (stats[x], x))

      # not sure why we do this, maybe to ensure that the threshold reflects the
      # lower values in stats after the transfer from big_stats
      threshhold = stats[most_frequent] * i/(i+10000.0)
      prune_stats(stats, big_stats, threshhold)
    
    if stats[most_frequent] < min_frequency:
      print(f"No pair has frequency >= {min_frequency}, exiting\n")
      break

    #print(f"Pair {i+1}/{vocab_size}: {most_frequent[0]} {most_frequent[1]} -> {most_frequent[0]}{most_frequent[1]} [Frequency: {stats[most_frequent]}]")

    outfile.write('{0}{1}\n'.format(*most_frequent))
    token_list.append('{0}{1}'.format(*most_frequent))

    # Replace A B -> AB
    changes = replace_pair(most_frequent, sorted_vocab, indices)

    update_pair_statistics(most_frequent, changes, stats, indices)
    stats[most_frequent] = 0

    # If we're not at the end prune our stats and start again.
    if not i % 100:
      prune_stats(stats, big_stats, threshhold)


tokenizer_id = sys.argv[1]
subword_vocab_count = int(sys.argv[2])
training_file = sys.argv[3]



outfile = open("out.txt", "w")

token_list = []

start_time = time.perf_counter()
train_bpe(training_file, subword_vocab_count, outfile, token_list)
end_time = time.perf_counter()

elapsed_time = end_time - start_time

print(f"\nTraining time: {elapsed_time:.6f}")

outfile.close()

import requests

BASE = "http://127.0.0.1:5000/"

response = requests.post(BASE + "api/tokenizer/complete", json={"_id": tokenizer_id, "training_time": elapsed_time, "tokens": token_list}).text
print(response)

#print(token_list)
