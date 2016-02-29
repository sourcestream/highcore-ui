'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.projectService
 * @description
 * # projectService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('projectService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/projects/:projectId', [], {
        'create': {
            method: 'POST'
        },
        'copy': {
            method: 'POST',
            url: API_ENDPOINT + '/projects?source=/projects/:id'
        },
        'get': {
            method: 'GET'
        },
        'query': {method: 'GET', isArray: true},
        'save': {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}]);
