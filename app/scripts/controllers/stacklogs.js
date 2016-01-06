'use strict';

/**
 * @ngdoc function
 * @name highcoreWebUI.controller:LogsCtrl
 * @description
 * # LogsCtrl
 * Controller of the highcoreWebUI
 */
angular.module('highcoreWebUI')
    .controller('StackLogsCtrl', ['$scope', 'stackLogsService', '$routeParams', function ($scope, stackLogsService, $routeParams) {
        var stackId = $routeParams.stackId;
        $scope.reloadList = function(stackId) {
            $scope.logs = stackLogsService.get({
                stackId: stackId
            });
        };

        $scope.reloadList(stackId);
    }]);
