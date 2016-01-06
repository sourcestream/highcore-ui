# Pull the highcore-ui base image
FROM sourcestream/highcore-ui-base:0.2

MAINTAINER Angel Dimitrov <angel@sourcestream.de>

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
ENTRYPOINT node --harmony_arrow_functions --harmony_modules --harmony_strings index.js --domain=${DOMAIN} --endpoint=${ENDPOINT}