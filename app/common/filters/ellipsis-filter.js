(function() {
  'use strict';
  angular.module('chartbnb.filters').
    filter('ellipsis', function($filter){
      return function(input, limit){
        limit = limit || 15;
        if (!input || (input.length < limit)) { return input; }

        return $filter('limitTo')(input, limit) + "...";
      };
    });
})();
