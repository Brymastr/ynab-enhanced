FROM lambci/lambda:build-nodejs12.x as dependencies

COPY package*.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --quiet --only-prod



FROM lambci/lambda:build-nodejs12.x as build

ARG FUNCTION_NAME
ARG FUNCTION_SCOPE

COPY package*.json ./

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --quiet

COPY . ./

RUN npm run build -- $FUNCTION_NAME $FUNCTION_SCOPE



FROM amazon/aws-lambda-nodejs:12 as release

ARG FUNCTION_NAME
ARG FUNCTION_SCOPE

COPY --from=dependencies /var/task/node_modules ./node_modules/
COPY --from=build /var/task/dist/ .

ENV HANDLER=functions/$FUNCTION_SCOPE/$FUNCTION_NAME.handler

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
