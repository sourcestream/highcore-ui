'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUI.directive:stackGrid
 * @description
 * # stackGrid
 */
angular.module('highcoreWebUI')
    .directive('stackGrid', function ($document, $rootScope) {
        return {
            //restrict: 'E',
            //scope: {},
            link: function (scope, element) {





                //var components = scope.stack.components;
                //console.log(components);

                /*scope.$watch("components", function() {
                    console.info('change')
                });*/
/*
                var $stackContainer = element.parent();
                var $stackGrid = element;

                var startX = 0, startY = 0, x = 0, y = 0;

                $stackGrid.on("mousedown", function (event) {
                    event.preventDefault();

                    if ($(event.target)[0] !== $stackGrid[0]) {
                        return;
                    }

                    startX = event.screenX - x;
                    startY = event.screenY - y;

                    $document.on('mousemove', gridDragStart);
                    $document.on('mouseup', gridDragStop);

                });

                function gridDragStart(event) {
                    y = event.screenY - startY;
                    x = event.screenX - startX;

                    if (y > 0) y = 0;
                    if (x > 0) x = 0;

                    var offsetLimitLeft = $stackGrid.outerWidth() - $stackContainer.width(),
                        offsetLimitTop = $stackGrid.outerHeight() - $stackContainer.height();

                    if ((y + offsetLimitTop) < 0) {
                        y = offsetLimitTop * -1;
                    }

                    if ((x + offsetLimitLeft) < 0) {
                        x = offsetLimitLeft * -1;
                    }

                    $stackGrid.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }

                function gridDragStop() {
                    $document.off('mousemove', gridDragStart);
                    $document.off('mouseup', gridDragStop);
                }
*/
            }
        };
    });
