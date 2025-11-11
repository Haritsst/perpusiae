FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./book-service/package*.json ./
RUN npm install --production

COPY ./book-service ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3002
CMD ["npm", "start"]

