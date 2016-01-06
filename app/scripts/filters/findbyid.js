'use strict';

/**
 * @ngdoc filter
 * @name highcoreWebUI.filter:findById
 * @function
 * @description
 * # findById
 * Filter in the highcoreWebUI.
 */
angular.module('highcoreWebUI')
  .filter('findById', function () {
    return function(input, id) {
      var i=0, len=input.length;
      for (; i<len; i++) {
        if (input[i].id == id) {
          return input[i];
        }
      }
      return null;
    }
  });
