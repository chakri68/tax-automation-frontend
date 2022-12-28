FROM node:19-alpine3.16
WORKDIR /tax-automation-frontend
COPY . /tax-automation-frontend/
RUN set -eux \
    & apk add \
        --no-cache \
        nodejs \
        yarn
RUN yarn
RUN yarn build
CMD ["yarn","start"]
