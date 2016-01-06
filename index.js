"use strict"

const config      = require('./libs/config')();
const express     = require('./libs/express')(config);
const app         = express.app;
const userSession = express.userSession;
const proxy       = require('./libs/proxy')(app, config);
const user        = require('./libs/user')(app, config);
const socket      = require('./libs/socket')(app, config, userSession);
const monitor     = require('./libs/monitor')(app, config, socket);

app.listen(config.get('port'));