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
