'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.stackLogsService
 * @description
 * # notificationService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('stackLogsService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/stacks/:stackId/logs', [], {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
}]);
