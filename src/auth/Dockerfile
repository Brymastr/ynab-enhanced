FROM lambci/lambda:build-nodejs12.x as dependencies

ARG SERVICE_NAME
COPY ./$SERVICE_NAME/package*.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --quiet --only-prod


FROM lambci/lambda:build-nodejs12.x as build

ARG FUNCTION_NAME
ARG SERVICE_NAME

COPY ./$SERVICE_NAME ./

RUN echo ${FUNCTION_NAME}

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --quiet && \
    npm run build -- ${FUNCTION_NAME}


FROM amazon/aws-lambda-nodejs:12 as release

ARG FUNCTION_NAME

COPY --from=dependencies /var/task/node_modules ./node_modules/
COPY --from=build /var/task/dist/ .
RUN mv ${FUNCTION_NAME}.js ./app.js && mv ${FUNCTION_NAME}.js.map ./app.js.map

CMD [ "app.handler" ]