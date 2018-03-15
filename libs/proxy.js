"use strict";

const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');

module.exports = (app, config) => {

    const apiProxy = httpProxy.createProxyServer({
        changeOrigin: true,
        target: config.get('endpoint')
    });

    apiProxy.on('proxyReq', (proxyReq, req) => {
        const session = req.session;
        const auth = session.user.auth;

        proxyReq.setHeader("Authorization", "Basic " + new Buffer(auth.username + ":" + auth.password).toString('base64'));
    });

    apiProxy.on('error', (error) => {
        console.error(error);
    });

    app.all('/api/*', (req, res) => {

        if (req.session && req.session.user && req.session.user.auth) {
            req.url = req.url.replace('/api', '');
            apiProxy.web(req, res);
        } else {
            res.sendStatus(401); // non authorized
        }

    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    return apiProxy;
};