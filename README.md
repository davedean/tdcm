# tdcm
Tiny Docker Container Manager - manage containers easily, on most devices.

## why
Checking container status on phones sucks.

## screenshots

Main view:

<img width="835" alt="image" src="https://github.com/davedean/tdcm/assets/2696454/a27450ff-fad7-43c7-91b2-c23928905dea">


Container details:

<img width="533" alt="image" src="https://github.com/davedean/tdcm/assets/2696454/05883f95-9b29-499f-9c91-ef325ad87340">

## how

### run using docker-compose
The user you're running as will need access to the docker API. Does `docker ps` work for you? If so, you're good.

```shell
curl -O docker-compose.yml https://raw.githubusercontent.com/davedean/tdcm/main/docker-compose.yml
docker-compose up
```

### build locally
```shell
make build # build the container
```

### build/run locally
```shell
make run # build and run container
```
