'use strict';

const request = require('request');

module.exports = (app, config, io) => {

    io.on('connection', socket => {

        const session = socket.handshake.session;

        if (!session.user) {
            console.info(session);
            console.log('user session not started');
            return;
        }

        let user            = session.user;
        let auth            = user.auth;
        let monitoringTasks = {};

        socket.on('disconnect', () => {
            Object.keys(monitoringTasks).forEach(function(stackId) {
                let monitoringTask = monitoringTasks[stackId];
                clearInterval(monitoringTask);
            });
        });

        socket.emit('connected', {
            msg: 'you are connected to highcore-io ' + user.name
        });

        socket.on('minitor::stack::stop', stackId => {
            clearInterval(monitoringTasks[stackId]);
            delete monitoringTasks[stackId];
        });

        socket.on('minitor::stack::start', stackId => {
            if (monitoringTasks[stackId]) {
                return;
            }
            monitoringTasks[stackId]= setInterval(() => {

                request.get(config.get('endpoint') + '/stacks/' + stackId, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    auth: {
                        user: auth.username,
                        pass: auth.password,
                        sendImmediately: false
                    }
                }, (error, response, body) => {

                    let stackStatusData = {
                        stack_id: stackId,
                        components: []
                    };
                    try {

                        let stackData          = JSON.parse(body);
                        stackStatusData.status = stackData.status;

                        if (stackData.components) {
                            stackData.components.forEach(component => {

                                stackStatusData.components.push({
                                    id: component.id,
                                    status: component.status,
                                    outputs: component.outputs ? component.outputs : false
                                });

                            });
                        }
                        console.info(stackStatusData);
                        socket.emit('minitor::stack::update', stackStatusData);

                    } catch (e) {
                        console.error(e);
                    }
                });

            }, config.get('updateInterval'));
        });
    });
};