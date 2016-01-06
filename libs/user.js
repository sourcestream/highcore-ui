"use strict";

const http    = require('http');
const url     = require('url');
const request = require('request');

module.exports = (app, config) => {
    /**
     *
     * @param user
     * @param successFn
     * @param errorFn
     */
    const validateCredentials = (user, successFn, errorFn) => {
        request.get(config.get('endpoint') + '/users/me', {
            'auth': {
                'user': user.username,
                'pass': user.password,
                'sendImmediately': false
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                try {
                    const userData = JSON.parse(body);
                    successFn(userData);
                } catch(e) {
                    errorFn(e);
                }

            } else {
                errorFn(error);
            }
        });

    };

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    const auth = (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const username = req.body.username;
        const password = req.body.password;

        if (!username) {
            return res.end(JSON.stringify({
                error: 'username_missing', error_description: 'provide a valid username'
            }));
        }

        if (!password) {
            return res.end(JSON.stringify({
                error: 'password_missing', error_description: 'provide a valid password'
            }));
        }

        validateCredentials({
            username: username,
            password: password
        }, (userData) => {

            let session = req.session;

            session.user = {
                data: userData,
                auth: {
                    username: username,
                    password: password
                }
            };

            return res.end(JSON.stringify(userData));

        }, (error) => {
            return res.end(JSON.stringify(error));
        });

    };

    app.post('/auth', auth);
};