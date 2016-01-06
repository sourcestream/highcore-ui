'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUiApp.directive:componentStatus
 * @description
 * # componentStatus
 */
angular.module('highcoreWebUI')
    .directive('componentStatus', function () {
        return {
            link: function postLink(scope) { //, element, attrs

                scope.$watch('component.status', function(statusData){

                    scope.operation = statusData.operation;
                    scope.state     = statusData.state.replace('_' , ' ').toLowerCase();

                    switch(statusData.state) {
                        case 'FAILED':
                            scope.containerColor = 'red';
                            scope.textColor = 'white';
                            break;
                        case 'IN_PROGRESS':
                            scope.containerColor = 'yellow';
                            scope.textColor = 'black';
                            break;
                        case 'COMPLETE':
                            scope.containerColor = 'green';
                            scope.textColor = 'white';
                            break;
                        default:
                            scope.containerColor = 'blue';
                            scope.textColor = 'gray';
                    }
                });


            },
            templateUrl: 'views/component/_component_status.html'
        };
    });
