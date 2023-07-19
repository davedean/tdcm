FROM golang:latest as base

FROM base as dev

WORKDIR /build

# These first, so caching layers works as expected
COPY go.sum go.mod ./
RUN go mod download

# Now bring in the rest and build
COPY ./main.go  ./

ENV DOCKER_API_VERSION=1.39
RUN go build main.go

### runtime 
FROM alpine:latest as run
WORKDIR /opt/app/
COPY --from=dev /build/main /opt/app/main
COPY ./layout.html /opt/app/layout.html

CMD ["/opt/app/main"]