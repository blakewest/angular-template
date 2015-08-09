angular.module('chartbnb.services')
  .factory('appEndpoint', ['Restangular', 'restangularAuthConfig',
    function(Restangular, restangularAuthConfig){
    return function(){
      return Restangular.withConfig(function(RestangularConfigurer){
        restangularAuthConfig(RestangularConfigurer);
      });
    };
  }]);
