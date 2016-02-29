'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUiApp.controller:StackCtrl
 * @description
 * # StackCtrl
 * Controller of the highcoreWebUiApp
 */
angular.module('highcoreWebUI')
    .controller('StackCtrl', ['$scope', 'stackService', 'environmentService', 'projectService', 'templateService', '$routeParams', '$mdDialog',
        function ($scope, stackService, environmentService, projectService, templateService, $routeParams, $mdDialog) {

            var environmentId = $routeParams.environmentId,
                environment = environmentService.get({
                    environmentId : environmentId
                }, function(data) {
                    $scope.project = projectService.get({
                        projectId: data.project_id
                    })
                });

            var templates = templateService.query();

            $scope.templates   = templates;
            $scope.environment = environment;

        var loadStacks = function () {
            showMask();
            $scope.stacks = stackService.query({
                environmentId : $routeParams.environmentId
            }, function (data) {
                hideMask();

                //$scope.showStackDetails(data[1]);
            });
        };

        loadStacks();

        $scope.showStackDetails = function (stack, $event) {

            if ($event) {
                $event.stopPropagation();
            }

            $mdDialog.show({
                templateUrl: 'views/stack/_stack_edit.html',
                locals: {
                    stacks: $scope.stacks,
                    stack: stack,
                    environment: $scope.environment,
                    templates: templates,
                    project: $scope.project
                },
                controller: openDialog
            });
        };

        function openDialog($scope, $mdDialog, stack, environment, templates, project, stacks) {
            $scope.environment = environment;
            $scope.templates   = templates;
            $scope.project     = project;
            $scope.stacks      = stacks;



            if (stack) {

                showMask();
                $scope.stack = stackService.get({stackId: stack.id}, function (stack) {
                    if (!stack.parameters) {
                        stack.parameters = [];
                    }

                    hideMask();
                });
            } else {
                $scope.stack = {
                    environment_id : environment.id,
                    parameters: [],
                    stacks: []
                };
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(vegetable) {
                    return (angular.lowercase(vegetable.name).indexOf(lowercaseQuery) === 0);
                };
            }

            function querySearch (query) {
                var results = query ? $scope.stacks.filter(createFilterFor(query)) : [];
                return results;
            }



            $scope.querySearch = querySearch;

            $scope.removeStack = function (stack) {
                showMask();
                stack.$delete({
                    stackId: $scope.stack.id
                }, function () {
                    $mdDialog.hide();
                    loadStacks();
                });
            };

            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

            $scope.copyStack = function (stack, $event) {
              stackService.copy({
                id: stack.id
              }, {
                name: 'Copy of ' + stack.name
              }, function () {
                  $mdDialog.hide();
                  loadStacks();
              });
            };

            $scope.saveStack = function (stack, $event) {
                /*if (stack.relatedStack) { //TODO remove after a better UI solution
                    stack.stacks = [{ name: stack.relatedStack }];
                    delete stack.relatedStack;
                }*/
                showMask();
                if (stack.id) {
                    stack.$save({
                        stackId: $scope.stack.id
                    }, function () {
                        $mdDialog.hide();
                        loadStacks();
                    });
                } else {
                    stackService.create({}, stack, function () {
                        $mdDialog.hide();
                        loadStacks();
                    });
                }
            };
        }

    }]);
