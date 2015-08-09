'use strict';

/* jasmine specs for directives go here */

function compileDirective(template, scope){
  if (!template) { throw new Error("You must pass in a template to compileDirective"); }
  var $view = angular.element(template);
  angular.element(document.body).append($view); // So that css is included and jasmineJquery works
  inject(function($compile, _$rootScope_, _$httpBackend_) {
    // Setup basic backend stuff
    window.$httpBackend  = _$httpBackend_;
    window.$rootScope  = _$rootScope_;
    $compile($view)(scope);
  });
  scope.$digest();
  Behave.view = $view;
};

describe('directives', function() {
  beforeEach(module('app.directives'));
  beforeEach(module('app.templates'));
  // Example spec

  // describe('yourDirective', function(){
  //   var form, scope;
  //   describe('in one scenario', function(){
  //     var amount;
  //     var templateHTML = '' +
  //     '<form name="form" for="form">' +
  //       '<input name="amount" class="form-control" type="text" ng-model="input.amount" app-currency></input>' +
  //     '</form>';
  //     beforeEach(inject(function($compile, $rootScope){
  //       scope = $rootScope.$new();
  //       form = angular.element(templateHTML);
  //       $compile(form)(scope);
  //       scope.$digest();
  //     }));
  //     it("should start valid", function(){
  //       expect(scope.form.amount.$valid).toBe(true);
  //     });
  //     describe('some other scenario', function(){
  //       beforeEach(function(){
  //         amount.val('100').trigger('input');
  //       });
  //       it("should be valid", function(){
  //         expect(scope.form.amount.$valid).toBe(true);
  //       });
  //       it("should store a cent value on the scope", function(){
  //         expect(scope.input.amount).toEqual(10000);
  //       });
  //     });
  //   });
  // });
});
