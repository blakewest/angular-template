(function() {
  'use strict';
  angular.module('chartbnb.filters').
    filter('pluralize', function(){
        return function(number, string){
          if(_.isNumber(number) && parseInt(number, 10) === 1){
            // Only works for simple english
            return number + ' ' + string;
          }else{
            return number + ' ' + string + 's';
          }
        };
      });
})();
