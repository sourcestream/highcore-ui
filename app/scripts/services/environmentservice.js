'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.environmentService
 * @description
 * # environmentService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('environmentService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/environments/:environmentId', [], {
        'create': {
            method: 'POST'
        },
        'copy': {
            method: 'POST',
            url: API_ENDPOINT + '/environments?source=/environments/:id'
        },
        'get': {
            method: 'GET'
        },
        'query': {
            method: 'GET',
            isArray: true,
            url: API_ENDPOINT + '/projects/:projectId/environments'
        },
        'save': {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}]);
