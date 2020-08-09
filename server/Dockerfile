# ---- Base Node ----
FROM node:14.4.0-alpine3.11 AS base
# create non-root user
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
# set working directory
WORKDIR /home/node/app
# copy project file
COPY package*.json ./
COPY tsconfig.json .
# COPY .npmrc ./
# use non-root user
RUN chown -R node: /home/node
USER node

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
ARG NPM_TOKEN
RUN npm set progress=false && \
  npm config set depth 0 && \
  npm install --quiet

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --chown=node:node --from=dependencies /home/node/app/node_modules ./node_modules
# copy app sources
COPY --chown=node:node src/ src/
# delete .npmrc
# build
RUN npm run build && rm -rf src && rm tsconfig.json # && rm .npmrc
# start
CMD npm start