'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUiApp.directive:templateComponent
 * @description
 * # templateComponent
 */
angular.module('highcoreWebUI')
  .directive('templateComponent', function ($compile, $document, $rootScope) {
    return function(scope, element, attrs) {

        var $stackContainer = $('#grid');

        var isTemplateOverStack = function() {
            return element.offset().left >= $stackContainer.offset().left && element.offset().top >= $stackContainer.offset().top
        }

        var startX = 0, startY = 0, x = 0, y = 0;

        element.on('mousedown', function(event) {
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
            element.css({
                top: y + 'px',
                left:  x + 'px'
            });

        }

        function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);

            if (isTemplateOverStack()) {
                $rootScope.$emit('createStackComponentFromTemplate', element, scope);

            } else {
                console.info('outside stack');
            }

            element.removeAttr('style');
            startX = 0, startY = 0, x = 0, y = 0;
        }
    };
  });
