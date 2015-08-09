angular.module('chartbnb.services')
  .factory('providerEndpoint',
    function(Restangular, restangularAuthConfig){
    // Inherits from the authenticated restangular, but uses /api as a base
    return function(){
      return Restangular.withConfig(function(RestangularConfigurer){
        restangularAuthConfig(RestangularConfigurer);
        RestangularConfigurer.setBaseUrl('/api');
      });
    };
  });
