# Pull the highcore-ui base image
FROM node:7

MAINTAINER Angel Dimitrov <angel@sourcestream.de>

RUN apt-get update \
    && apt-get install -y -qq rubygems build-essential ruby-dev \
    && rm -rf /var/lib/apt/lists/* \
    && gem install sass compass --no-rdoc --no-ri \
    && npm install -g bower grunt-cli

ENV DOCKERIZE_VERSION v0.5.0
ADD https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz /tmp/dockerize.tar.gz
RUN tar -C /usr/local/bin -xzvf /tmp/dockerize.tar.gz \
    && rm /tmp/dockerize.tar.gz

# add highcore user
RUN useradd -ms /bin/bash highcore

# map sources
ADD . /opt/highcore-ui/
RUN chown -R highcore:highcore /opt/highcore-ui

USER highcore
ENV HOME /opt/highcore-ui
WORKDIR /opt/highcore-ui

# install dependencies
RUN npm install
RUN grunt build

# ŕun the app
EXPOSE 8080
EXPOSE 3000
ENTRYPOINT node index.js --domain=${DOMAIN} --endpoint=${ENDPOINT}