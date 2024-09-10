from app import scheduler
import os
import time

"""
Checks the testing output directory every 10 minutes and deletes
files older than 30 minutes.
"""
@scheduler.task('interval', id='clean_job', minutes=10, misfire_grace_time=900)
def clean_job():
  print("[CLEAN JOB]: Checking for files older than 30 mins!")
  
  # Get all files in the testing directory
  files = os.listdir("bpe/outputs/testing")

  # Loop through each file and check their creation timestamp
  # and delete if older than 30 minutes
  for file in files:
    file_creation_time=int(file.split("_")[0])
    current_time = int(time.time())
    time_difference = current_time - file_creation_time
    print(time_difference)
    if time_difference > 1800:
      print(f"[CLEAN JOB]: File {file} is {time_difference}s old, deleting.")
      os.remove("bpe/outputs/testing/"+file)

