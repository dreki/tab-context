# Use node as the base image
FROM node:19-alpine3.15

# Install yarn
RUN apk add --no-cache yarn

# Install bash
RUN apk add --no-cache bash

# Install build base
RUN apk add --no-cache build-base

# Important for installing node packages
WORKDIR /

COPY package.json package.json

# Install Node dependencies at `/node_modules` in the container.
RUN set -x \
    && yarn install --modules-folder=/node_modules

ENV PATH=/node_modules/.bin:$PATH

WORKDIR /app

# CMD ["/app/scripts/run.sh"]
