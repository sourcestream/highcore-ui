'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.componentService
 * @description
 * # componentService
 * Service in the highcoreWebUI.
 */
angular.module('highcoreWebUI')
    .service('componentService', ['$filter', function ($filter, stackService) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            addParameter: function (component, parameter) {
                if (!component.parameters) {
                    component.parameters = [];
                }
                if (!$filter('findById')(component.parameters, parameter.id)) {
                    component.parameters.push(parameter);
                }

                return component.parameters.indexOf(parameter);
            },
            removeParameter: function (component, parameterId) {
                var obsoleteParameter = $filter('findById')(component.parameters, parameterId);
                if (obsoleteParameter) {
                    var obsoleteParameterIndex = component.parameters.indexOf(obsoleteParameter);
                    component.parameters.splice(obsoleteParameterIndex, 1);
                }

                if (component.parameters.length == 0) {
                    delete component.parameters;
                }
            },
            /**
             *
             * @param templateComponent
             * @param defaults
             * @returns {*}
             */
            createFromTemplate: function (templateComponent, defaults) {

                if (!defaults) defaults = {};

                var component = angular.merge({
                    id: templateComponent.id,
                    template_component: templateComponent.id,
                    parameters: [],
                    ui: angular.merge(templateComponent.ui, defaults.ui)
                }, defaults);

                if (templateComponent.components) {
                    var components = [];
                    angular.forEach(templateComponent.components, function (component) {
                        angular.forEach(component.parameters, function (parameter) {
                            var _c = {};
                            _c[parameter.id] = component.id;
                            _c['template_component'] = component.id;
                            _c['required'] = 'required' in parameter ? parameter.required : false;
                            components.push(_c);
                        })
                    });
                    component.components = components;
                }

                if (templateComponent.parameters) {
                    angular.forEach(templateComponent.parameters, function (parameter) {
                        component.parameters.push({
                            id: parameter.id,
                            value: parameter.default ? parameter.default : ''
                        })
                    });
                }

                return component;
            },
            /**
             *
             */
            setComponents: function (component) {
                angular.forEach(component.components, function (dependencyComponent) {
                    angular.forEach(dependencyComponent.parameters, function (dependencyComponentParameter) {
                        dependencyComponent.template_component = dependencyComponent.id;
                        //console.info('id = ' + dependencyComponentParameter.id);
                    });
                });

                //TODO define what to return;
            },
            /**
             *
             * @param component
             * @returns {Array}
             */
            getComponents: function (component) {
                var components = [];

                if (component.components) {
                    component.components;
                }

                return components;
            }


        }
    }]);
