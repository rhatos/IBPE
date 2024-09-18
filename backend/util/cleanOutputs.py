from app import scheduler
import os
import time

"""
Checks the testing output directory every 10 minutes and deletes
files older than 30 minutes.
"""
@scheduler.task('interval', id='clean_job_outputs', minutes=30, misfire_grace_time=900)
def clean_job_outputs():
  print("[CLEAN JOB]: Checking for output files older than 30 mins!")
  
  # Get all files in the testing directory
  files = os.listdir("bpe/outputs/testing")

  # Loop through each file and check their creation timestamp
  # and delete if older than 30 minutes
  for file in files:
    file_creation_time=int(os.path.getctime(f"bpe/outputs/testing/{file}"))
    current_time = int(time.time())
    time_difference = current_time - file_creation_time
    if time_difference > 1800 and file != ".gitkeep":
      print(f"[CLEAN JOB]: File {file} is {time_difference}s old, deleting.")
      os.remove("bpe/outputs/testing/"+file)

@scheduler.task('interval', id='clean_job_uploads', minutes=1, misfire_grace_time=900)
def clean_job_uploads():
  print("[CLEAN JOB]: Checking for uploads older than 5 minutes!")
  
  # Get all files in the testing directory
  files = os.listdir("bpe/uploads/tokenizerTrainingFiles")

  # Loop through each file and check their creation timestamp
  # and delete if older than 5 minutes
  for file in files:
    file_creation_time=int(os.path.getctime(f"bpe/uploads/tokenizerTrainingFiles/{file}"))
    current_time = int(time.time())
    time_difference = current_time - file_creation_time
    if time_difference > 300 and file != ".gitkeep":
      print("clena")
      print(f"[CLEAN JOB]: File {file} is {time_difference}s old, deleting.")
      os.remove("bpe/uploads/tokenizerTrainingFiles/"+file)
  
    files = os.listdir("bpe/uploads/testTokenizerFiles")

    for file in files:
      file_creation_time=int(os.path.getctime(f"bpe/uploads/testTokenizerFiles/{file}"))
      current_time = int(time.time())
      time_difference = current_time - file_creation_time
      if time_difference > 300 and file != ".gitkeep":
        print(f"[CLEAN JOB]: File {file} is {time_difference}s old, deleting.")
        os.remove("bpe/uploads/testTokenizerFiles/"+file)
