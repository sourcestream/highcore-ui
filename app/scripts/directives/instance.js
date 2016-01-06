'use strict';

/**
 * @ngdoc directive
 * @name highcoreWebUI.directive:instance
 * @description
 * # instance
 */
angular.module('highcoreWebUI')
    .directive('instance', function (gridService) {
        return function (scope, $element, attrs) {

            var component            = scope.component,
                $componentElement    = angular.element($element[0]),
                paper                = Snap($element.parent()[0]),
                componentUI          = Snap($element[0]),
                componentId          = component.id,
                componentUIContainer = componentUI.select('circle[component-ui="container"]'),
                componentUIConnector = componentUI.select('*[component-ui="connector"][connector-type="origin"]');

            //FIXME
            if (!component.ui) {
                component.ui = {
                    position: {
                        x: 100 + 120 * scope.$index,
                        y: 100
                    },
                    icon : {
                        url: 'images/icon.svg'
                    }
                }
            }

            scope.$watch('component', function(newState, oldState) {

                if (newState.id !== oldState.id) {
                    var currentConnections = gridService.getUIConnectionsByComponentId(oldState.id);
                    angular.forEach(currentConnections, function(connection) {
                        connection.remove();
                    }, this);
                    return;
                }

                if (!gridService.isComponentValid(component)) {
                    componentUIContainer.attr({
                        'stroke': '#DF3A01',
                        'stroke-width': 3
                    });
                } else {
                    componentUIContainer.attr({
                        'stroke-width': 0
                    });
                }
            }, true);


            animateIndicator();

            // Infinite animation
            function animateIndicator() {
                componentUI.select('g[component-animation]').stop().animate(
                    {transform: 'r360,50,50'}, // Basic rotation around a point. No frills.
                    7000, // Nice slow turning rays
                    function () {
                        componentUI.select('g[component-animation]').attr({transform: 'rotate(0 50 50)'}); // Reset the position of the rays.
                        animateIndicator(); // Repeat this animation so it appears infinite.
                    }
                );
            }
            var moveFnc = function (dx, dy, x, y) {
                    var lx = dx + ox;
                    ly = dy + oy;

                    this.transform('t' + lx + ',' + ly);

                    var componentUIx               = gridService.getUICoordinatesByComponentId(componentId).x,
                        componentUIy               = gridService.getUICoordinatesByComponentId(componentId).y,
                        componentOriginConnections = gridService.getUIConnectionByOriginId(componentId),
                        componentTargetConnections = gridService.getUIConnectionsByTargetId(componentId);

                    angular.forEach(componentTargetConnections, function (line) {
                        line.attr({
                            'x2' : componentUIx,
                            'y2' : componentUIy
                        })
                    });

                    angular.forEach(componentOriginConnections, function (line) {
                        line.attr({
                            'x1' : componentUIx,
                            'y1' : componentUIy
                        });
                    });

                },
                startFnc = function (x, y, e) {
                    //e.preventDefault();
                    //componentUI.appendTo(paper);
                },
                endFnc = function () {
                    ox = componentUI.matrix.e,
                    oy = componentUI.matrix.f;

                    $componentElement.trigger('dragComponentEnd', [ox, oy]);
                    gridService.setComponentUICoordinates(component, ox, oy)
                };


            if (component.ui && component.ui.container) {
                componentUIContainer.attr(component.ui.container);
            }
            componentUI.transform('t' + component.ui.position.x + ',' + component.ui.position.y)
            componentUI.drag(moveFnc, startFnc, endFnc);

            var lx = 0,
                ly = 0,
                ox = componentUI.matrix.e,
                oy = componentUI.matrix.f;

            Snap.load(component.ui.icon.url, function (data) {
                componentUI.append(data)
            }, this);

            if (!component.components) {
                componentUIConnector.remove();
            } else {
                var componentUIConnectorLine;

                componentUIConnector.drag(function (dx, dy) { //dragConnectorMove

                    $componentElement.trigger('dragConnectorMove');

                    componentUIConnector.attr({
                        "cx": this.ox + dx,
                        "cy": this.oy + dy
                    });

                    componentUIConnectorLine.attr({
                        'x1' : this.ox + dx,
                        'y1' : this.oy + dy
                    });

                }, function () { // dragConnectorStart
                    $componentElement.trigger('dragConnectorStart');
                    componentUI.undrag();
                    componentUI.prependTo(paper);

                    angular.forEach(gridService.getUIConnectionsByComponentId(componentId), function(connectionUI) {
                        connectionUI.prependTo(paper);
                    });
                    componentUIConnectorLine = paper.line(
                        parseInt(componentUIConnector.attr('cx')),
                        parseInt(componentUIConnector.attr('cy')),
                        parseInt(componentUIContainer.attr('cx')),
                        parseInt(componentUIContainer.attr('cy'))
                    ).attr({
                            'stroke': "red",
                            'strokeWidth': 4
                        }).prependTo(componentUI);



                    this.ox = parseInt(componentUIConnector.attr("cx"));
                    this.oy = parseInt(componentUIConnector.attr("cy"));




                }, function () { //dragConnectorEnd

                    $componentElement.trigger('dragConnectorEnd');
                    componentUI.drag(moveFnc, startFnc, endFnc);

                    componentUIConnector.attr({
                        cy: this.oy,
                        cx: this.ox
                    });


                    componentUIConnectorLine.remove();
                });
            }

        }
    });
