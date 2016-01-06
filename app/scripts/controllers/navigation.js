'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the highcoreWebUI
 */
angular.module('highcoreWebUI')
    .controller('NavigationCtrl', ['$scope', '$rootScope', '$cookies', '$location', 'userService', '$mdSidenav',
        function ($scope, $rootScope, $cookies, $location, userService, $mdSidenav) {

            $rootScope.user = userService.getCurrent();

            $scope.items = [
                {
                    title: 'Projects',
                    location : 'projects'
                }
            ];

            $scope.logout = function() {
                $cookies.remove('connect.sid', {
                    path: '/',
                    domain: $location.host()
                });

                delete $rootScope.user;
                navigateTo('auth');
            };

            $scope.navigateTo = function(location, $event) {
                navigateTo(location);
                $scope.toggleNavigation();
            };

            $scope.toggleNavigation = function () {
                $mdSidenav('mainNavigation').toggle();
            };

        }]);
