FROM ubuntu:20.04
WORKDIR /rippletracker
COPY . .
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y software-properties-common \
    && apt-get update \
    && apt-get install -y curl make build-essential nodejs npm \
    && npm install 

EXPOSE 5000

CMD npm start

