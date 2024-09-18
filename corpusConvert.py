
# python corpusConvert.py <word count> <input file>

import sys

word_number = sys.argv[1]
file_name = sys.argv[2]
output_file = open(f"output_{word_number}_{file_name}", "w")
input_file = open(file_name, "r")

output_file.write("")
output_file.close()

output_file = open(f"output_{word_number}_{file_name}", "a")

word_count = 0

for line in input_file.readlines():
  words_in_line = len(line.split(" "))
  word_count += words_in_line
  output_file.write(line)
  if(word_count >= int(word_number)):
    break

input_file.close()
output_file.close()


