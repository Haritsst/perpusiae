FROM node:18-alpine

# 1. Set working directory
WORKDIR /usr/src/app

# 2. Install build tools untuk compile bcrypt
RUN apk add --no-cache python3 g++ make

# 3. Copy file package.json dan package-lock.json
COPY ./auth-service/package*.json ./

# 4. Install dependencies di container
RUN npm install --production

# 5. Copy seluruh source code
COPY ./auth-service ./
COPY ./shared/proto /usr/src/shared/proto

# 6. Expose port
EXPOSE 50051

# 7. Jalankan service
CMD ["npm", "start"]
