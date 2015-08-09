(function() {
  'use strict';
  angular.module('chartbnb.filters').
    filter('capitalize', function() {
      return function(input) {
        return input && input[0].toUpperCase() + input.slice(1);
      };
    });
})();
