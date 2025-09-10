FROM node:20-alpine

LABEL maintainer="benxfoxy@gmail.com"

WORKDIR /app

COPY ./frontend /app

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]