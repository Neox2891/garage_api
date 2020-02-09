FROM node:13.8.0-alpine3.10

RUN apk update \
    && apk --no-cache --update add build-base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3030
CMD [ "node", "server.js" ]