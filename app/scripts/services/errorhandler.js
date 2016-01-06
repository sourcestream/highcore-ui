'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.errorHandler
 * @description
 * # stackService
 * Service in the highcoreWebUI.
 */
angular.module('highcoreWebUI')
  .service('errorHandler', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            responseError: function(response) {
                console.error(response);
                alert(JSON.stringify(response));
            }
        }
  });
