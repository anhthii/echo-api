FROM node:13.13.0-alpine3.10
WORKDIR /usr/src/echo-api
ADD package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]

EXPOSE 3000
