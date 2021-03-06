'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUiApp.controller:EnvironmentCtrl
 * @description
 * # EnvironmentCtrl
 * Controller of the highcoreWebUiApp
 */
angular.module('highcoreWebUI')
    .controller('EnvironmentCtrl', ['$scope', 'environmentService', 'projectService', '$routeParams', '$mdDialog', '$mdToast',
        function ($scope, environmentService, projectService, $routeParams, $mdDialog) {

            var projectId = $routeParams.projectId,
                project = projectService.get({
                    projectId: projectId
                });

            $scope.project = project;

            var loadEnvironments = function () {
                showMask();
                $scope.environments = environmentService.query({
                    projectId: $routeParams.projectId
                }, function () {
                    hideMask();
                });
            };

            loadEnvironments();

            $scope.showEnvironmentDetails = function (environment, $event) {

                if ($event) {
                    $event.stopPropagation();
                }

                $mdDialog.show({
                    templateUrl: 'views/environment/_environment_edit.html',
                    locals: {
                        environment: environment,
                        project: $scope.project
                    },
                    controller: openDialog
                });
            };

            function openDialog($scope, $mdDialog, environment, project) {

                $scope.project = project;

                if (environment) {
                    showMask();
                    $scope.environment = environmentService.get({
                        environmentId: environment.id
                    }, function (environment) {
                        if (!environment.parameters) {
                            environment.parameters = [];
                        }
                        hideMask();
                    });
                } else {
                    $scope.environment = {
                        project_id : project.id,
                        parameters: []
                    };
                }

                $scope.removeEnvironment = function (environment, $event) {
                    var confirm = $mdDialog.confirm()
                        .parent(angular.element(document.body))
                        .title('Would you like to delete the environment ' + environment.name + '?')
                        .content('All of the banks have agreed to forgive you your debts.')
                        .ariaLabel('Delete confirmation')
                        .ok('OK')
                        .cancel('Cancel');
                    $mdDialog.show(confirm).then(function() {
                        showMask();
                        environment.$delete({
                            environmentId: environment.id
                        }, function () {
                            $mdDialog.hide();
                            loadEnvironments();
                        });
                    }, function() {
                        //$scope.alert = 'You decided to keep your debt.';
                    });
                };

                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

                $scope.copyEnvironment = function (environment, $event) {
                    showMask();
                    environmentService.copy({
                        id: environment.id
                    }, {
                        name: 'copy-of-' + environment.name
                    }, function () {
                        $mdDialog.hide();
                        loadEnvironments();
                    });
                };

                $scope.saveEnvironment = function (environment, $event) {
                    showMask();
                    if (environment.id) {
                        environment.$save({
                            environmentId: environment.id
                        }, function () {
                            $mdDialog.hide();
                            loadEnvironments();
                        });
                    } else {
                        environmentService.create({}, environment, function () {
                            $mdDialog.hide();
                            loadEnvironments();
                        });
                    }
                };
            }

        }]);