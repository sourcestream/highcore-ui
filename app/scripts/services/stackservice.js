'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.stackService
 * @description
 * # stackService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('stackService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/stacks/:stackId', [], {
        'create': {
            method: 'POST'
        },
        'copy': {
          method: 'POST',
          url: API_ENDPOINT + '/stacks?source=/stacks/:id'
        },
        'get': {
            method: 'GET'
        },
        'queryByEnvironment': {
            method: 'GET',
            isArray: true,
            url: API_ENDPOINT + '/environments/:environmentId/stacks'
        },
        'queryByTemplate': {
            method: 'GET',
            isArray: true,
            url: API_ENDPOINT + '/templates/:templateId/stacks'
        },
        'save': {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}]);
