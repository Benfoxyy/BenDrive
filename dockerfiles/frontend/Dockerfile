FROM node:20-alpine
WORKDIR /app

COPY ./frontend /app
RUN npm ci
RUN npm run build

EXPOSE 3000
# pass args to the npm script via "--"
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
