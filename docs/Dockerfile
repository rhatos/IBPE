FROM node:latest
WORKDIR app
COPY . /app
RUN npm install
COPY . .
EXPOSE 5174
CMD ["npm", "run", "start"]