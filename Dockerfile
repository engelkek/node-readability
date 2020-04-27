FROM node:14-slim

LABEL maintainer="kengelke@protonmail.com"

EXPOSE 13000

RUN apt update && apt -y install git && mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node ./src .

CMD [ "node", "app.js" ]