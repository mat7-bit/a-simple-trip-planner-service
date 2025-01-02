FROM node:22-alpine

WORKDIR /app

COPY ./src /app/src
COPY ./package.json /app
COPY ./tsconfig.json /app

RUN npm install
RUN npm run build:ts

# Set the entry point for the container
CMD ["node", "dist/server.js"]
