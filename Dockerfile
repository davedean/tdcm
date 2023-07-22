#################### build react
FROM node:19.8.1-alpine3.17 AS frontendbuild

WORKDIR /build

# easily cached layer first
COPY react/hello-world/package.json /build/package.json
COPY react/hello-world/package-lock.json /build/package-lock.json
# the [s] is a hack, so node_modules is only copied if it exists 
COPY react/hello-world/node_module[s] /build/node_modules

RUN npm install

COPY react/hello-world/public /build/public
COPY react/hello-world/src /build/src
RUN npm run build

################## build back end
FROM golang:alpine as backendbuild

WORKDIR /build

# TODO: This is hard coded, client wasn't negotiating with server
ENV DOCKER_API_VERSION=1.39

# These first, so caching layers works as expected
COPY go.sum go.mod ./
RUN go mod download

# Now bring in the rest and build
COPY ./main.go  ./
RUN go build main.go

######## assemble runtime
FROM alpine:latest as run
WORKDIR /app
COPY --from=frontendbuild /build/build /app/assets
COPY --from=backendbuild /build/main /app/main

# dont think I need this?
# COPY ./views /app/views

CMD ["/app/main"]
