FROM node:12-alpine

# /configs will have prebuilt commitlint configs to use without setup
RUN mkdir -p /configs
COPY package.json /configs
COPY package-lock.json /configs
RUN cd /configs && npm ci

# And this is the code of the action itself
COPY index.js /

# See entrypoint.sh, it has magic for selecting the right node_modules to run commitlint over
COPY entrypoint.sh /
ENTRYPOINT /entrypoint.sh
