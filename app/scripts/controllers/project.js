'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUiApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the highcoreWebUiApp
 */
angular.module('highcoreWebUI')
    .controller('ProjectCtrl', ['$scope', 'projectService', '$mdDialog', '$mdToast', function ($scope, projectService, $mdDialog, $mdToast) {

        var loadProjects = function () {
            showMask();
            $scope.projects = projectService.query({}, function () {
                hideMask();
            });
        };

        loadProjects();

        $scope.showProjectDetails = function (project, $event) {

            if ($event) {
                $event.stopPropagation();
            }

            $mdDialog.show({
                templateUrl: 'views/project/_project_edit.html',
                locals: {
                    project: project
                },
                controller: openDialog
            });
        };

        function openDialog($scope, $mdDialog, project) {

            if (project) {
                showMask();
                $scope.project = projectService.get({
                    projectId: project.id
                }, function (project) {
                    if (!project.parameters) {
                        project.parameters = [];
                    }
                    hideMask();
                });
            } else {
                $scope.project = {
                    parameters: []
                };
            }

            $scope.removeProject = function (project, $event) {
                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .title('Would you like to delete the project ' + project.name + '?')
                    .content('All of the banks have agreed to forgive you your debts.')
                    .ariaLabel('Delete confirmation')
                    .ok('OK')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    showMask();
                    project.$delete({
                        projectId: project.id
                    }, function () {
                        $mdDialog.hide();
                        loadProjects();
                    });
                }, function() {
                    //$scope.alert = 'You decided to keep your debt.';
                });
            };

            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

            $scope.copyProject = function (project, $event) {
                showMask();
                projectService.copy({
                    id: project.id
                }, {
                    name: 'copy-of-' + project.name
                }, function () {
                    $mdDialog.hide();
                    loadProjects();
                });
            };

            $scope.saveProject = function (project, $event) {
                showMask();
                if (project.id) {
                    project.$save({
                        projectId: project.id
                    }, function () {
                        $mdDialog.hide();
                        loadProjects();
                    });
                } else {
                    projectService.create({}, project, function () {
                        $mdDialog.hide();
                        loadProjects();
                    });
                }
            };
        }

    }]);