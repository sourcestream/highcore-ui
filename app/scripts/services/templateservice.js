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
        'query': {
            method: 'GET',
            isArray: true
        }

    });
}]);
