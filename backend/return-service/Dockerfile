FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./return-service/package*.json ./
RUN npm install --production

COPY ./return-service ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3004
CMD ["npm", "start"]

