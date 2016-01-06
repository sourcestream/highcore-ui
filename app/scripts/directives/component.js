'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUI.directive:component
 * @description
 * # component
 */
angular.module('highcoreWebUI')
    .directive('component', function ($document, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/component/_stack-component.html',
            link: function (scope, element, attr) {
                //console.info(scope.component);
                //var $stackGrid = element.parent();

                var startX = 0, startY = 0, x = 0, y = 0;
                if (scope.component.ui) {
                    if (scope.component.ui.position.top) {
                        element.css({
                            top: scope.component.ui.position.top
                        });
                    }

                    if (scope.component.ui.position.left) {
                        element.css({
                            left: scope.component.ui.position.left
                        });
                    }
                }

                y = element.position().top;
                x = element.position().left;

                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.screenX - x;
                    startY = event.screenY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.screenY - startY;
                    x = event.screenX - startX;

                    if (x < 0) x = 0;
                    if (y < 0) y = 0;

                    element.css({
                        top: Math.round(y) + 'px',
                        left: Math.round(x) + 'px'
                    });
                }

                function mouseup() {

                    y = event.screenY - startY;
                    x = event.screenX - startX;

                    $rootScope.$emit('componentMoved', element, scope);

                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
            }
        }
    });
