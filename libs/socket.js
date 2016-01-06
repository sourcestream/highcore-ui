'use strict';

const sharedsession = require('express-socket.io-session');

module.exports = (app, config, session) => {
    const io    = require('socket.io')(config.get('socketPort'));
    const monitorio = require('monitor.io');

    io.use(monitorio({ port: 8000 }));
    io.use(sharedsession(session));

    return io;
};