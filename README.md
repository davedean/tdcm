# tdcm
Tiny Docker Container Manager - manage containers easily, on most devices.

<img width="838" alt="image" src="https://github.com/davedean/tdcm/assets/2696454/d7b2d58a-7a98-4362-91d0-78bd4024a3cd">


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
