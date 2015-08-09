'use strict';
angular.module('chartbnb', [
  'ui.router', 'restangular', 'chartbnb.directives', 'chartbnb.filters',
  'chartbnb.services', 'chartbnb.controllers', 'chartbnb.templates']
);
angular.module('chartbnb').config([
  '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$provide',
  function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $provide) {
  RestangularProvider.setBaseUrl('/api');

  // RestangularProvider.setErrorInterceptor = function(){
  //   //deal with errors
  // };

  // Now let's configure the response extractor for each request
  RestangularProvider.setDefaultHttpFields({timeout: 15 * 1000});

  // RestangularProvider.setFullResponse(true);
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
    if(angular.isObject(data)){ data.headers = response.headers(); }
    return data;
  });

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider.
    state('error', {
      url: '/error/{status:[0-9]+}',
      templateUrl: '/static/shared/error.html',
      controller: 'ErrorController'
    }).
    state('home', {
      url: '/',
      templateUrl: '/static/home/home.html',
      controller: "HomeController",
      controllerAs: 'vm',
    });
}]);

angular.module('chartbnb').run(['$rootScope', '$state', '$stateParams',
  function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // State Changes
    $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
      $state.go('error', {status: error.status});
      evt.preventDefault();
      console.log("State change error! ", error.message); // jshint ignore:line
      console.log("Stack trace:", error.stack); // jshint ignore:line
      console.log("Event: " + evt.name + " heading to: " + to.url + ", from:", from.url); // jshint ignore:line
    });
}]);
