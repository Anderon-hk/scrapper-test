ARG NODE_VERSION=18.0.0 #place holder for node version

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/,npm \
    npm ci --include=dev

USER node
COPY . .
CMD npm run dev