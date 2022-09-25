FROM node:16.17.0-alpine3.16

WORKDIR /app/

RUN MKDIR -p /app/node_modules/

COPY package*.json ./

COPY yarn*.json ./

RUN chown -R node:node /app/

RUN yarn install

EXPOSE 3002