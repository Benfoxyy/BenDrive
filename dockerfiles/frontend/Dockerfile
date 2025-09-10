FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend ./
RUN npm run build
EXPOSE 3000
# Serve the built static files
# CRA outputs "build"; Vite outputs "dist" (change path accordingly)
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
# If Vite: CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
