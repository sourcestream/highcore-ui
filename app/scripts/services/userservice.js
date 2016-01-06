'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.userService
 * @description
 * # userService
 * Service in the highcoreWebUI.
 */

angular.module('highcoreWebUI').service('userService',
    ['$resource', '$rootScope', '$http', 'errorHandler', function ($resource, $rootScope, $http, errorHandler) {

    return {
        getCurrent: function() {
            var user = $resource(API_ENDPOINT + '/users/me', [], {
                'me': {
                    method: 'GET'
                }
            });

            user.me(function(data) {
                $rootScope.user = data;
            });
        },
        login: function(credentials, successFn, errorFn) {
            $http.post(AUTH_ENDPOINT, credentials).
                then(function(response) {
                    if (response.data && response.data.id) {
                        successFn(response);
                    } else {
                        errorFn(successFn);
                    }
                }, errorFn);
        },
        logout: function() {
            $cookies.remove('connect.sid', {
                path: '/',
                domain: $location.host()
            });

            delete $rootScope.user;
        }
    }

}]);