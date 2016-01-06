'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:ParameterCtrl
 * @description
 * # ParameterCtrl
 * Controller of the highcoreWebUI
 */
angular.module('highcoreWebUI')
    .controller('ParameterCtrl', ['$scope', function ($scope) {

        $scope.addParameter = function () {
            //if (!$scope.parameters) $scope.parameters = [];

            $scope.parameters.push({
                id: '',
                value: ''
            })
        };

        $scope.removeParameter = function(index) {
            $scope.parameters.splice(index, 1);
        };

    }]);
