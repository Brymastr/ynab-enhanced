# build stage
FROM node:14.4.0-alpine3.11 as build-stage

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont 

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install puppeteer@5.2.1

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --production

# production stage
FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]