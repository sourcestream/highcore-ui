'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUiApp.controller:ComponentCtrl
 * @description
 * # ComponentCtrl
 * Controller of the highcoreWebUiApp
 */
angular.module('highcoreWebUI')
  .controller('ComponentCtrl', function($scope, $mdDialog, activeComponent, activeTemplateComponent, componentService, gridService) {
        $scope.activeComponent         = activeComponent;
        $scope.activeTemplateComponent = activeTemplateComponent;
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        $scope.toggleComponentParameter = function (parameterId) {
            return;
            var $defaultParameterField = $('[edit-component] [data-parameter-id=' + parameterId + '][data-default]'),
                $customParameterActiveField = $('[edit-component] [name=' + parameterId + '][type=checkbox]');

            if (!$customParameterActiveField.prop('checked')) {
                componentService.removeParameter($scope.activeComponent, parameterId);
            } else {
                componentService.addParameter($scope.activeComponent, {
                    id: parameterId,
                    value: $defaultParameterField.val()
                });
            }
        };

        $scope.removeStackComponent = function (componentId) {


            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('Would you like to delete the component ' + activeComponent.id + '?')
                .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Delete confirmation')
                .ok('OK')
                .cancel('Cancel')
                //.targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                //$scope.alert = 'You decided to get rid of your debt.';
                gridService.removeStackComponent(componentId);
                gridService.isStackValid();
                delete $scope.activeComponent;
                delete $scope.activeTemplateComponent;

            }, function() {
                //$scope.alert = 'You decided to keep your debt.';
            });

            return;
        };
    });
