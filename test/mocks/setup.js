'use strict';
window.setupTestBackend = function(opts){
  opts = opts || {};
  module('app', 'app.templates');
  inject(function($compile, _$location_, _$rootScope_, _$httpBackend_, _$timeout_, _$state_){
    window.$scope        = _$rootScope_;
    window.$httpBackend  = _$httpBackend_;
    window.$state        = _$state_;
    window.$timeout      = _$timeout_;
    window.$location     = _$location_;
    window.$rootScope  = _$rootScope_;

    window.$view = angular.element('<ng-app="app"><ui-view></ui-view></ng-app>');
    angular.element(document.body).append($view);

    window.visit = function(url, opts){
      $location.url(url);
      $scope.$apply();

      opts = opts || {};
      if (opts.flush !== false) { $httpBackend.flush(); }
    };

    $compile($view)($scope);

    Behave.view = $(document.body);
  });
};

window.tearDownAndVerify = function() {
  $view.remove();
  $(document.body).find('.modal').remove();
  $(document.body).find('.modal-backdrop').remove();
  $httpBackend.verifyNoOutstandingExpectation();
};
