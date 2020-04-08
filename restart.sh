#!/bin/sh

docker stop api
docker rm api
docker rmi api

docker build -t api .

docker run --name api --network=leaveApp -v /home/leaveAppAPI:/app/src -v /home/uploads:/app/src/uploads -p 9000:9000 --restart always -d api