"use strict";

const flags = require('flags');

module.exports = () => {
    flags.defineString('endpoint', '', 'the endpoint of the highcore API');
    flags.defineString('domain', '', 'the domain of the application. needed to set correct cookies');
    flags.defineInteger('socketPort' , 3000);
    flags.defineInteger('port', 8080);
    flags.defineInteger('updateInterval', 20000, 'update interval for the stack status pull');
    flags.parse();

    console.log('endpoint:', flags.get('endpoint'));
    console.log('domain:', flags.get('domain'));
    console.log("App listening on port ", flags.get('port'));
    console.log("socket.io listening on port ", flags.get('socketPort'));
    console.log("updateInterval ", flags.get('updateInterval'));

    return flags;
}