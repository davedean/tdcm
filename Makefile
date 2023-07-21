default: build

run: build
	docker-compose up

build: Dockerfile
	docker build -t ghcr.io/davedean/tdcm:main .
