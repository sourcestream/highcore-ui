'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUiApp.directive:widget
 * @description
 * # widget
 */
angular.module('highcoreWebUI')
    .directive('widget', function (stackService) {
        return {
            //template: '<text x="0" y="0"> cpu: {{ stackNotifications[component.id].cpu.currentValue + stackNotifications[component.id].cpu.unit}}  mem: {{ stackNotifications[component.id].memory.currentValue + stackNotifications[component.id].memory.unit}} </text>',
            //restrict: 'E',
            templateUrl: 'views/component/_component_metrics.html',
            link: function postLink(scope, element, attrs) {
/*
                var componentId = scope.component.id,
                    componentUI = stackService.getComponentUIById(componentId),
                    widgetKey   = scope.key,
                    widgetIndex = scope.$index,
                    metric      = scope.metric;

                scope.$watch('metric', function() {

                    var widget = componentUI.select('[component-ui=widget][widget-key=' + widgetKey + ']');
                    if (widget) {
                        var fill = 'green';

                        if (scope.metric.currentValue / 100 > 0.3) {
                            fill = 'yellow';
                        }

                        if (scope.metric.currentValue / 100 > 0.7) {
                            fill = 'red';
                        }

                        widget.animate({
                            r: 10 + 2 * scope.metric.currentValue / 100,
                            fill: fill
                        }, 2000);
                    } else {
                        widget = componentUI.circle(90, 10 + 22 * widgetIndex, 10).attr({
                            'component-ui' : 'widget',
                            'widget-key'   : widgetKey,
                            'fill'         : 'aqua'
                        });
                    }

                });*/

            }
        };
    });
