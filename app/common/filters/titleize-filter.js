(function() {
  'use strict';
  angular.module('chartbnb.filters').
    filter('titleize', function() {
      return function(str) {
        if (str == null) { return ''; } // jshint ignore:line
        str = String(str).toLowerCase();
        return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
      };
    });
})();
