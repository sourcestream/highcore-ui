'use strict';

/**
 * @ngdoc overview
 * @name highcoreWebUI
 * @description
 * # highcoreWebUI
 *
 * Main module of the application.
 */
angular
    .module('highcoreWebUI', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'ngTouch',
        'jsonFormatter',
        'chart.js'
    ]).
    factory('highcoreIO', function ($rootScope) {
        var socket;
        return {
            connect: function() {
                socket = io.connect(IO_ENDPOINT);
            },
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })
    .run(function($rootScope, $mdDialog, drawerService) {
        $rootScope.navigateTo = navigateTo;

        $rootScope.closeDialog = function() {
            console.info('closeDialog');
            $mdDialog.hide();
        };

        $rootScope.toggleDrawer = function(drawerId) {
            drawerService.toggle(drawerId);
        };
        $rootScope.closeAllDrawers = function() {
            drawerService.closeAll();
        };

    }).config(['$mdThemingProvider', function($mdThemingProvider) {
        // Extend the red theme with a few different colors
        var neonRedMap = $mdThemingProvider.extendPalette('blue', {
            '500': '455A64'
        });
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('neonRed', neonRedMap);
        // Use that theme for the primary intentions
        $mdThemingProvider.theme('default')
            .primaryPalette('neonRed')
    }])
    .config(['$httpProvider', function ($httpProvider) {

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;

        $httpProvider.interceptors.push(function($q) {
            return {
                'responseError': function(rejection){
                    var defer = $q.defer();
                    if(rejection.status == 401){
                        navigateTo('auth');
                        hideMask();
                    } else {
                        alert(JSON.stringify(rejection));
                    }
                    defer.reject(rejection);
                    return defer.promise;
                }
            };
        });

    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/stacks/:stackId', {
                templateUrl: 'views/grid.html',
                controller: 'GridCtrl'
            })
            .when('/templates', {
                templateUrl: 'views/template.html',
                controller: 'TemplateCtrl'
            })
            .when('/templates/:templateId', {
                templateUrl: 'views/stack.html',
                controller: 'StackCtrl'
            })
            .when('/projects', {
                templateUrl: 'views/project.html',
                controller: 'ProjectCtrl'
            })
            .when('/projects/:projectId', {
                templateUrl: 'views/environment.html',
                controller: 'EnvironmentCtrl'
            })
            .when('/environments/:environmentId', {
                templateUrl: 'views/stack.html',
                controller: 'StackCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/auth', {
              templateUrl: 'views/auth.html',
              controller: 'AuthCtrl'
            })
            .otherwise({
                redirectTo: '/projects'
            });
    }]);

var initMask = function() {
    $('[ng-view]').append(
        '<md-mask-container>' +
        '    <md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
        '</md-mask-container>'
    );
}

initMask();

var showMask = function() {
    $('md-mask-container ').show();
};

var hideMask = function() {
    $('md-mask-container ').hide();
};

var navigateTo = function(route) {
    window.location = '#' + route;
};

var IO_ENDPOINT   = ':3000',
    API_ENDPOINT  = '/api',
    AUTH_ENDPOINT = '/auth';