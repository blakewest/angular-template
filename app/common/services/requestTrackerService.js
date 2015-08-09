angular.module('chartbnb.services')
  .factory('requestTracker', ['$rootScope', function($rootScope){
    $rootScope.loading = {count: 0, spinner: false};
    return {
      loading: function(){
        $rootScope.loading.count += 1;
        $rootScope.loading.spinner = $rootScope.loading.count > 0;
        return $rootScope.loading;
      },
      done: function(){
        $rootScope.loading.count -= 1;
        $rootScope.loading.spinner = $rootScope.loading.count > 0;
        return $rootScope.loading;
      }
    };
  }]);
