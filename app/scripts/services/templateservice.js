'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.templateService
 * @description
 * # templateService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('templateService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/templates/:templateId', [], {
        'create': {
            method: 'POST'
        },
        'copy': {
            method: 'POST',
            url: API_ENDPOINT + '/templates?source=/templates/:id'
        },
        'get': {
            method: 'GET'
        },
        'query': {
            method: 'GET',
            isArray: true
        },
        'save': {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}]);
