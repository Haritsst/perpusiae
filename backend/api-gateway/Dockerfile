FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./api-gateway/package*.json ./
RUN npm install --production

COPY ./api-gateway ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3000
CMD ["npm", "start"]

