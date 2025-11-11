FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./loan-service/package*.json ./
RUN npm install --production

COPY ./loan-service ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3003
CMD ["npm", "start"]

