Installation
=======

## Note the new setup script name for Node.js v0.12
    sudo curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

## install nodejs and build deps
    sudo apt-get install nodejs build-essential ruby-dev -y

## install bower
    sudo npm install -g bower

## install grunt
    sudo npm install -g grunt-cli

## install compass
    sudo gem install compass

## install node depencencies
    npm install

## build dist files]
    grunt build

## start the production server
    node --harmony_arrow_functions --harmony_modules --harmony_strings index.js --domain={HIGHCORE UI DOMAIN} --endpoint={HIGHCORE API ADDRESS}


Configuration
=============

The following flags are available

| Name | Description | Default value |
|---|---|---|
| endpoint | the endpoint of the highcore API | NO DEFAULT VALUE |
| domain | the domain of the application. needed to set correct cookies | NO DEFAULT VALUE |
| socketPort | listening port for socket.io | 3000 |
| port | listening port for the web application | 8080 |
| updateInterval | update interval for the stack status pull | 20000 |

Docker
=======

## use our docker image
    docker run -p 8080:8080 -p 3000:3000 -e ENDPOINT={HIGHCORE API ADDRESS} -e DOMAIN={HIGHCORE UI DOMAIN} -d sourcestream/highcore-ui:latest-SNAPSHOT
    
## build your own docker image
    docker-compose build ui


