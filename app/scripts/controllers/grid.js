'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:GridCtrl
 * @description
 * # GridCtrl
 * Controller of the highcoreWebUI
 */
angular.module('highcoreWebUI')
    .controller('GridCtrl', ['$scope', '$rootScope', '$compile', '$document', '$resource', '$http', '$filter', '$routeParams',
        'stackService', 'gridService', 'highcoreIO', '$mdDialog', '$mdSidenav', '$mdToast', 'componentService', 'templateComponentService',
        function ($scope, $rootScope, $compile, $document, $resource, $http, $filter, $routeParams, stackService,
                  gridService, highcoreIO, $mdDialog, $mdSidenav, $mdToast, componentService, templateComponentService) {

            showMask();

            var stackId = $routeParams.stackId;

            if ($rootScope.user) {
                highcoreIO.connect();

                $scope.$on("$destroy", function(){
                    highcoreIO.emit('minitor::stack::stop', stackId);
                });

                highcoreIO.emit('minitor::stack::start', stackId);

                highcoreIO.on('connected', function (data) {
                    $mdToast.show($mdToast.simple().content(data.msg));
                });

                highcoreIO.on('minitor::stack::update', function (stackData) {
                    if (stackData.stack_id !== stackId) return;

                    angular.forEach(stackData.components, function (component) {
                        var _component = gridService.getStackComponentById(component.id);
                        if (_component) {

                            if (component.status) {
                                _component.status = component.status;
                            }

                            if (component.outputs) {
                                _component.outputs = component.outputs;
                            }

                        }
                    })
                });
            }

            $scope.toggleTemplateComponents = function () {
                $mdSidenav('templateComponents').toggle();
            };

            $scope.downloadTemplate = function(diff) {
                window.open('/api/stacks/' + stackId + '/templates/cloudformation' + (diff == true ? '?diff=true': ''), '_blank');
            };

            $scope.editComponent = function (component) {
                $mdDialog.show({
                    templateUrl: 'views/component/_component_edit.html',
                    locals: {
                        activeComponent: component,
                        activeTemplateComponent: $filter('findById')($scope.templateComponents, component.template_component)
                    },
                    controller: 'ComponentCtrl'
                });
            };

            $scope.focusInstance = function (component) {
                $scope.activeComponent = component;
                $scope.activeTemplateComponent = $filter('findById')($scope.templateComponents, component.template_component);
            };


            $scope.scaleFactor = 1;
            $scope.zoomIn = function () {
                $scope.scaleFactor += 0.1;
                gridService.getGridUI().transform('scale(' + Number($scope.scaleFactor).toFixed(1) + ')');
            };

            $scope.zoomOut = function () {
                $scope.scaleFactor -= 0.1;
                gridService.getGridUI().transform('scale(' + Number($scope.scaleFactor).toFixed(1) + ')');
            };

            $scope.zoomReset = function () {
                $scope.scaleFactor = 1;
                gridService.getGridUI().transform('scale(' + Number($scope.scaleFactor).toFixed(1) + ')');
            };
            if ($rootScope.$$listeners['createStackComponentFromTemplate']) { //prevent this listener to be defined multiple times
                delete $rootScope.$$listeners['createStackComponentFromTemplate'];
            }
            $rootScope.$on('createStackComponentFromTemplate', function (event, element, scope) {

                var templateComponent   = scope.templateComponent,
                    templateComponentId = templateComponent.id;

                if (gridService.getStackComponentById(templateComponentId)) {
                    alert('component with the id ' + templateComponentId + ' already exists in this stack')
                    return;
                }

                var component = componentService.createFromTemplate(templateComponent, {
                    ui: {
                        position: {
                            x: element.offset().left - $('#grid').offset().left,
                            y: element.offset().top - $('#grid').offset().top
                        }
                    }
                });

                gridService.addComponent($scope.stack, component);

                $scope.$apply();
                $mdSidenav('templateComponents').close();
                $scope.editComponent(component);
            });


            var connection = {};

            $scope.toggleList = function() {
                $mdSidenav('stackLogs').toggle();
            };


            $scope.stack = stackService.get({
                stackId: stackId
            }, function (data) {
                $scope.templateComponents = templateComponentService.query({
                    templateId: $scope.stack.template_id
                }, function () {
                    hideMask();
                });
                gridService.setStack(data);

                $scope.$watch('stack', function () {
                    gridService.isStackValid();
                }, true);

                $scope.$watch('stack', onStackChange, true);
                $scope.stacks = stackService.query({
                    environmentId: $scope.stack.environment_id
                });

            });

            $scope.saveStack = function () {

                delete $scope.stack.parameters; //FIXME
                delete $scope.stack.ui; //FIXME
                delete $scope.stack.stacks; //FIXME

                $scope.stack.$save({
                    stackId: stackId
                });
            };

            $scope.provisionStack = function () {
                delete $scope.stack.parameters; //FIXME
                delete $scope.stack.ui; //FIXME
                delete $scope.stack.stacks; //FIXME
                //$scope.stack.provision = true; //FIXME

                $scope.stack.$save({
                    provision: true,
                    stackId: stackId
                });
            }

            $scope.deprovisionStack = function () {
                delete $scope.stack.parameters; //FIXME
                delete $scope.stack.ui; //FIXME
                delete $scope.stack.stacks; //FIXME
                //$scope.stack.deprovision = true; //FIXME

                $scope.stack.$save({
                    deprovision: true,
                    stackId: stackId
                });
            }

            /**
             *
             */
            var onStackChange = function () {

                //$scope.editComponent($scope.stack.components[2]);
                //gridService.clearAllConnections();

                setTimeout(function () {
                    angular.forEach($scope.stack.components, function (component) {

                        var componentId = component.id,
                            componentElement = gridService.getElementByComponentId(componentId);

                        componentElement.off('dragConnectorStart')
                            .off('dragConnectorEnd')
                            .off('disconnected');

                        componentElement.on('dragConnectorStart', function () {

                            connection.origin = {};
                            connection.origin.id = componentId;
                            connection.template_component = component.template_component;

                            angular.forEach(component.components, function (dependencyComponent) {

                                var allowedConnectionComponents = gridService.getStackComponentsByTemplateId(dependencyComponent.template_component)

                                angular.forEach(allowedConnectionComponents, function (allowedComponent) {

                                    var allowedComponentUI = gridService.getComponentUIById(allowedComponent.id),
                                        allowedComponentTargetConnectorUI = allowedComponentUI.select('*[component-ui="connector"][connector-type="target"]');

                                    allowedComponentTargetConnectorUI.attr({
                                        "fill": "#00FF00",
                                        "fill-opacity": 0.5
                                    });

                                    allowedComponentTargetConnectorUI.appendTo(allowedComponentUI)

                                    allowedComponentTargetConnectorUI.mouseover(function () {
                                        connection.target = {};
                                        connection.target.id = allowedComponent.id;
                                        connection.target.template_component = allowedComponent.template_component;
                                    });

                                    allowedComponentTargetConnectorUI.mouseout(function () {
                                        delete connection.target;
                                    });

                                })
                            });

                        });

                        componentElement.on('dragConnectorEnd', function () {

                            angular.forEach(component.components, function (dependencyComponent) {
                                var allowedConnectionComponents = gridService.getStackComponentsByTemplateId(dependencyComponent.template_component)
                                angular.forEach(allowedConnectionComponents, function (allowedComponent) {

                                    var allowedComponentUI = gridService.getComponentUIById(allowedComponent.id),
                                        allowedComponentTargetConnectorUI = allowedComponentUI.select('*[component-ui="connector"][connector-type="target"]');

                                    allowedComponentTargetConnectorUI.attr({
                                        "fill-opacity": 0
                                    });

                                    allowedComponentTargetConnectorUI.unmouseover();
                                    allowedComponentTargetConnectorUI.unmouseout();

                                    if (connection.target) {
                                        var _t = $filter('filter')(component.components, {template_component: connection.target.template_component})[0]
                                        _t.id = connection.target.id;
                                        $scope.$apply();
                                    }
                                    connection = {};
                                })
                            });

                        });

                        componentElement.on('disconnected', function (event, originComponentId, targetComponentId) {
                            var _t = $filter('filter')(component.components, {template_component: gridService.getStackComponentById(targetComponentId).template_component});//_t.id  ='';
                            _t[0].id = '';
                            //gridService.disconnect(originComponentId, targetComponentId);
                            $scope.$apply();
                        });

                        // make connections
                        if (component.components) {
                            angular.forEach(component.components, function (targetComponent) {

                                if (targetComponent.id) {
                                    gridService.connect(component.id, targetComponent.id);
                                }
                            });
                        }
                    });

                }, 10);
            };
        }]);
