'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUiApp.controller:TemplateCtrl
 * @description
 * # TemplateCtrl
 * Controller of the highcoreWebUiApp
 */
angular.module('highcoreWebUI')
    .controller('TemplateCtrl', ['$scope', 'templateService', '$mdDialog', '$mdToast', function ($scope, templateService, $mdDialog, $mdToast) {

        var loadTemplates = function () {
            showMask();
            $scope.templates = templateService.query({}, function () {
                hideMask();
            });
        };

        loadTemplates();

        $scope.showTemplateDetails = function (template, $event) {

            if ($event) {
                $event.stopPropagation();
            }

            $mdDialog.show({
                templateUrl: 'views/template/_template_edit.html',
                locals: {
                    template: template
                },
                controller: openDialog
            });
        };

        function openDialog($scope, $mdDialog, template) {

            if (template) {
                showMask();
                $scope.template = templateService.get({
                    templateId: template.id
                }, function (template) {
//                    if (!template.parameters) {
//                        template.parameters = [];
//                    }
                    hideMask();
                });
            } else {
                $scope.template = {
                    parameters: []
                };
            }

            $scope.removeTemplate = function (template, $event) {
                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .title('Would you like to delete the template ' + template.name + '?')
                    .content('All of the banks have agreed to forgive you your debts.')
                    .ariaLabel('Delete confirmation')
                    .ok('OK')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    showMask();
                    template.$delete({
                        templateId: template.id
                    }, function () {
                        $mdDialog.hide();
                        loadTemplates();
                    });
                }, function() {
                    //$scope.alert = 'You decided to keep your debt.';
                });
            };

            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

            $scope.copyTemplate = function (template, $event) {
                showMask();
                templateService.copy({
                    id: template.id
                }, {
                    name: 'copy-of-' + template.name
                }, function () {
                    $mdDialog.hide();
                    loadTemplatess();
                });
            };

            $scope.saveTemplate = function (template, $event) {
                showMask();
                if (template.id) {
                    template.$save({
                        templateId: template.id
                    }, function () {
                        $mdDialog.hide();
                        loadTemplates();
                    });
                } else {
                    templateService.create({}, template, function () {
                        $mdDialog.hide();
                        loadTemplates();
                    });
                }
            };
        }

    }]);