FROM python:alpine
EXPOSE 5000
WORKDIR app
COPY . /app
RUN pip install -r requirements.txt
CMD ["python", "-u", "app.py"]