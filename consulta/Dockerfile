FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
