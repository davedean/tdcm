# tdcm
Tiny Docker Container Manager - manage your containers in a simple way, on most devices.

## why
I tried to check container status on my phone, and it was a pain. A simpler, phone friendly container manager seems like a fun project.

## how 
Two options, compile/run the golang.

### golang
```shell
go build main.go
./main
```

### docker-compose
The user you're running as will need access to the docker api. Does `docker ps` work for you? If so, you're good.

```shell
curl -O docker-compose.yml https://raw.githubusercontent.com/davedean/tdcm/main/docker-compose.yml
docker-compose up
```
