FROM node:alpine

WORKDIR /usr/steam-extractor

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]