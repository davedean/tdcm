# tdcm
Tiny Docker Container Manager - manage containers easily, on most devices.

Main view:
<img width="789" alt="image" src="https://github.com/davedean/tdcm/assets/2696454/acba60f8-2163-47f0-90c0-a2bef7ed77e4">

Container details:
<img width="533" alt="image" src="https://github.com/davedean/tdcm/assets/2696454/05883f95-9b29-499f-9c91-ef325ad87340">

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
