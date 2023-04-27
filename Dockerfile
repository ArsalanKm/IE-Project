FROM node:16-alpine

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn","dev"]