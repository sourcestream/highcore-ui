'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.stackMonitorService
 * @description
 * # templateService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('stackMonitorService', ['highcoreIO', function (highcoreIO) {
    return {
        start: function(stackId) {
            highcoreIO.emit('minitor::stack::stop', stackId);
        },
        stop: function(stackId) {
            highcoreIO.emit('minitor::stack::start', stackId);
        },
        socket: function() {

        }
    }
}]);
