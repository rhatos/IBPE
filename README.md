# Interactive BPE Tokenizer - Capstone 2024 [Group 112]

Our Interactive BPE Tokenizer serves as a hands-on educational tool to help interested individuals learn the fundamentals of Natural Language Processing (NLP) by training and testing BPE tokenizers.

### Link To Repository:

https://gitlab.cs.uct.ac.za/capstone-2024/capstone-2024

##### Members

- Ethan Lawrence (LWRETH001)
- Kirsten Sutherland (STHKIR002)
- Conor Karl McKeag (MCKCON007)

## USAGE

### Set ENV values

Create a `.env` file in `/frontend`

Add: `VITE_BACKEND_API_URL="http://127.0.0.1:5000"`

### Docker Instructions

Ensure you have [Docker/Docker Desktop](https://www.docker.com/) installed.

`docker-compose up -d`

It may take some time but it will eventually be running in the background.

#### Frontend

After docker is done building the frontend should be available at `http://localhost:8080`

#### Docs

The docs are available at either [this GitPage](https://rhatos.github.io/capstone-docs), or locally at `http://localhost:3000`

### MongoDB

It is running at `localhost:27017`

`Username: capstone2024`

`Password: changeme123`

Make sure you have the mongoDB extension installed, `MongoDB for VS Code`
