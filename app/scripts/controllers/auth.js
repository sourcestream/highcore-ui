'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the highcoreWebUI
 */

angular.module('highcoreWebUI')
    .controller('AuthCtrl', ['$scope', '$rootScope', 'userService', '$http', function ($scope, $rootScope, userService, $http) {

        var successFn = function(response) {
            userService.getCurrent();
            navigateTo('projects');
        };

        var errorFn = function(response) {
            delete $scope.user.password;
            alert('login failed');
        };

        $scope.login = function() {
            userService.login($scope.user, successFn, errorFn);
        };
    }]);
