FROM node:15-alpine as build
ENV NPM_CONFIG_COLOR false
ENV NPM_CONFIG_PROGRESS false
ENV NPM_CONFIG_SPIN false
WORKDIR /node
RUN apk --no-cache \
  --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
  add git py3-pip make build-base libressl-dev
RUN pip3 install gyp-next
RUN git clone https://git.rip/freezer/freezerpc.git/ .
#build app
RUN npm i && \
  cd app && \
  npm i
#build frontend
RUN cd /node/app/client && \
  npm i && \
  npm run build

FROM node:15-alpine
COPY --from=build /node /node
RUN apk --no-cache \
  --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
  add libressl-dev musl-dev
WORKDIR /node/app
COPY main.js main.js
ENTRYPOINT ["node","main.js"]
