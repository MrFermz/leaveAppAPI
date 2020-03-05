#!/bin/sh

docker stop api
docker rm api
docker rmi api

docker build -t api .

docker run --name api --network=leaveApp -v /home/docker/leaveAppAPI:/app/src -p 9000:9000 --restart always -d api