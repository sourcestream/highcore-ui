"use strict";

const session    = require('express-session');
const express    = require('express');

module.exports = (config) => {
    const app = express();

    const userSession = session({
        secret: 'pS30XLA3p2tYXu7j6SYR',
        resave: false,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: false,
            domain: config.get('domain'),
            maxAge: 1000 * 60 * 24 * 400 // 24 hours
        }
    });


    app.use(express.static(__dirname + '/../dist'));

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Credentials", true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(userSession);

    return {
        app: app,
        userSession: userSession
    };
};