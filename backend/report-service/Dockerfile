FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./report-service/package*.json ./
RUN npm install --production

COPY ./report-service ./
COPY ./shared/proto /usr/src/shared/proto

EXPOSE 3005
CMD ["npm", "start"]


