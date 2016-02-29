'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.stackService
 * @description
 * # stackService
 * Service in the highcoreWebUI.
 */
angular.module('highcoreWebUI')
    .service('gridService', function ($filter) {
        return {
            setTemplatesComponents: function (templateComponents) {
                this.templateComponents = templateComponents;
            },
            isStackValid: function () {
                var isValid = true;

                angular.forEach(this.getStackComponents(), function (component) {
                    if (this.isComponentValid(component) == false) {
                        isValid = false;
                    }
                }, this);

                return isValid;
            },
            isComponentValid: function (component) {
                var isValid     = true,
                    componentId = component.id;

                if (component.components) {
                    angular.forEach(component.components, function (dependencyComponent) {
                        if (dependencyComponent.required && !this.getStackComponentById(dependencyComponent.id)) {
                            isValid = false;
                            angular.forEach(this.getUIConnectionByOriginId(componentId), function(connection) {
                                var targetId = connection.attr('target-id');
                                if (!this.getStackComponentById(targetId)) {
                                    connection.remove();
                                }
                            }, this);
                        }
                    }, this);
                }

                return isValid;
            },
            setStack: function (stack) {
                this.stack = stack;
            },
            getStack: function () {
                if (!this.stack) {
                    console.error('no stack set');
                    return;
                } else {
                    return this.stack;
                }
            },
            getStackComponents: function () {
                return this.getStack().components || [];
            },

            getStackComponentById: function (componentId) {
                //return $filter('filter')(this.getStackComponents(), {id: componentId});
                return $filter('findById')(this.getStackComponents(), componentId);
            },
            addComponent: function (stack, component) {

                if (!stack.components) {
                    stack.components = [];
                }
                stack.components.push(component);

            },
            copyStackComponent: function (componentId) {
                console.log(componentId);
                var component = angular.copy(this.getStackComponentById(componentId));
                component.id = 'copy_of_' + component.id;
                component.ui.position.x += 50;
                component.ui.position.y += 50;
                this.addComponent(this.stack, component);
            },
            removeStackComponent: function (componentId) {
                this.isStackValid();
                var component = this.getStackComponentById(componentId),
                    componentIndex = this.getStackComponents().indexOf(component);

                this.getStackComponents().splice(componentIndex, 1);
                return componentIndex;
            },
            getGridUI: function () {
                return Snap('svg > g');
            },
            getContainerRadius: function (_componentUIGroup) {
                return Number(_componentUIGroup.select('[component-ui="container"]').attr('r'));
            },
            getComponentUIById: function (componentId) {
                return this.getGridUI().select('g[component-id="' + componentId + '"]');
            },
            getComponentContainerUIById: function(componentId) {
                return this.getComponentUIById(componentId).select('*[component-ui=container]');
            },
            clearAllConnections: function () {
                this.getGridUI().selectAll('line[component-ui=connection]').remove();
            },
            getUICoordinatesByComponentId: function(componentId) {
                return this.getUICoordinates(this.getComponentUIById(componentId));
            },
            getUICoordinates : function(_componentUI) {
                var componentUIContainerRadius = Number(_componentUI.select('[component-ui="container"]').attr('r'));
                return {
                    x : Number(_componentUI.getBBox().x +  componentUIContainerRadius),
                    y : Number(_componentUI.getBBox().y +  componentUIContainerRadius)
                };
            },
            getElementByComponentId: function(componentId) {
                return angular.element('g[component-id=' + componentId + ']');
            },
            setComponentUICoordinates: function(component, x, y) {
                component.ui.position = {
                    'x' : x,
                    'y' : y
                };
            },
            getUIConnectionsByComponentId: function(componentId) {
                return this.getGridUI().selectAll('[component-ui=connection][target-component-id= ' + componentId + '], [component-ui=connection][origin-component-id= ' + componentId + ']');
            },
            getUIConnectionsByTargetId: function(componentId) {
                return this.getGridUI().selectAll('[component-ui="connection"][target-component-id= ' + componentId + ']');
            },
            getUIConnectionByOriginId: function(componentId) {
                return this.getGridUI().selectAll('[component-ui="connection"][origin-component-id= ' + componentId + ']');
            },
            connect: function (originComponentId, targetComponentId) {
                var gridUI = this.getGridUI();

                if (this.getGridUI().select('[component-ui="connection"][origin-component-id="' + originComponentId + '"][target-component-id="' + targetComponentId + '"]')) {
                    return true;
                }

                var originComponentUI = this.getComponentUIById(originComponentId),
                    targetComponentUI = this.getComponentUIById(targetComponentId);

                if (!targetComponentUI || !originComponentUI) {
                    // destroy invalid connections if any
                    return false;
                }
                var ocy = this.getUICoordinates(originComponentUI).x,
                    ocx = this.getUICoordinates(originComponentUI).y,
                    tcx = this.getUICoordinates(targetComponentUI).x,
                    tcy = this.getUICoordinates(targetComponentUI).y;

                var lineColor = originComponentUI.select('circle[component-ui="container"]').attr('fill');

                var line = gridUI.line(ocy, ocx, tcx, tcy).attr({
                    'origin-component-id': originComponentId,
                    'target-component-id': targetComponentId,
                    'component-ui': 'connection',
                    'stroke': lineColor,//"#000",
                    'strokeWidth': 4
                });

                line.prependTo(gridUI); // move to back


                line.click(function () {
                    line.remove();
                    this.getElementByComponentId(originComponentId).trigger('disconnected', [originComponentId, targetComponentId]);
                }.bind(this));

                line.mouseover(function() {
                    this.attr('stroke', 'red');
                });

                line.mouseout(function() {
                    this.attr('stroke', lineColor);
                });

                return true;
            },
            disconnect: function(originComponentId, targetComponentId) {
                console.info(arguments);
                //TODO
            },
            getStackComponentsByTemplateId: function (templateComponentId) {
                return $filter('filter')(this.getStackComponents(), {template_component: templateComponentId});
            }
        };
    });