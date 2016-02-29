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
                showMask();
                project.$delete({
                    projectId: project.id
                }, function () {
                    $mdDialog.hide();
                    loadProjects();
                });
            };

            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

            $scope.copyProject = function (project, $event) {
                projectService.copy({
                    id: project.id
                }, {
                    name: 'Copy of ' + project.name
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