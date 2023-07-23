# tdcm
Tiny Docker Container Manager - manage containers easily, on most devices.

## why
Checking container status on phones sucks. 

## how 

### run using docker-compose
The user you're running as will need access to the docker api. Does `docker ps` work for you? If so, you're good.

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
