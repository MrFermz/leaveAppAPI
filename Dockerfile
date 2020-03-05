FROM node:12.16.1-alpine3.9

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 9000

CMD ["./start.sh"]