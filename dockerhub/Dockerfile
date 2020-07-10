FROM node:12-alpine

ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY index.js .
COPY entrypoint.sh .

ENTRYPOINT ["/entrypoint.sh"]
