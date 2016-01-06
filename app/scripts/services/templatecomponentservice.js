'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.templateComponentService
 * @description
 * # templateService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('templateComponentService', ['$resource', 'errorHandler', function ($resource, errorHandler) {
    return $resource(API_ENDPOINT + '/templates/:templateId/components', [], {
        'query': {
            method: 'GET',
            isArray: true
        }

    });
}]);
