'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:LogsCtrl
 * @description
 * # LogsCtrl
 * Controller of the highcoreWebUI
 */
angular.module('highcoreWebUI')
    .controller('StackChartsCtrl', ['$scope', function ($scope) {
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.data1 = [65, 59, 80, 81, 56, 55, 40];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
    }]);
