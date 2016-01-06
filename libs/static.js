"use strict";

module.exports = (app, config) => {
    app.use(express.static(__dirname + '/dist'));
    return {

    }
};