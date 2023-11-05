ARG NODE_VERSION=18.0.0 #place holder for node version

FROM node:${NODE_VERSION}-bullseye-slim as base
WORKDIR /app
USER node
COPY . .
# CMD npm run dev

FROM base as dev2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chrome that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && service dbus start \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r -f audio \
    && groupadd -r -f video \
    && usermod -a G audio,video node

COPY package.json .
COPY pnpm-lock.yaml .

RUN --mount=type=bind,source=package.json,target=package.json \
    # --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    --mount=type=cache,id=pnpm,target=/pnpm/store
