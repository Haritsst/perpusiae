FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./user-service/package*.json ./
RUN npm install --production

COPY ./user-service ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3001
CMD ["npm", "start"]

