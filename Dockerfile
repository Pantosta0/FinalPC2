FROM node:16.14.0

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
