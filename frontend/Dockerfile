FROM node:24.8.0-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 1337
