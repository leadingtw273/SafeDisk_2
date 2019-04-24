# build stage
FROM node:8.12.0-alpine
WORKDIR /app
COPY package.json /app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

COPY . /app

# Expose the listening port of your app
EXPOSE 3000
CMD [ "pm2-runtime", "start", "pm2.config.js", "--env", "production" ]