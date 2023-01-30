FROM node:16.17.0-alpine3.16

WORKDIR /app/

RUN mkdir -p /app/node_modules/

COPY package*.json ./

#COPY yarn*.json ./

RUN chown -R node:node /app/

RUN yarn global add nodemon
RUN yarn install

COPY . .

EXPOSE 3002