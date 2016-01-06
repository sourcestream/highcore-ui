'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUI.directive: resourceSummary
 * @description
 * #  resourceSummary
 */
angular.module('highcoreWebUI')
    .directive('ressourceSummary', function () {
        return {
            link: function postLink(scope) { //, element, attrs


            },
            templateUrl: 'views/directives/_ressource-summary.html'
        };
    });
