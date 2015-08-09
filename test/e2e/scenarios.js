'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('logging in', function(){
  beforeEach(function() {
    browser().navigateTo('/');
  });
  it('should load', function(){
    browser().navigateTo('#/');
    expect(browser().location().path()).toBe('/login');
  });
  it('should have a login link', function(){
    expect(element('a.login').text()).toEqual('Sign In');
  });
  describe("with credentials", function(){
    beforeEach(function(){
      input('form.email').enter('joe@example.com');
      input('form.password').enter('passATexampleDOTScom');
      element('.form-signin .btn').click();
    });
    xit('should submit a request', function(){
      expect(browser().location().path()).toBe('/patients');
      expect(element('a.login:visible').count()).toBe(0);
    });

  });
});
// describe('my app', function() {

//   beforeEach(function() {
//     browser().navigateTo('../../app/index.html');
//   });


//   it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
//     expect(browser().location().url()).toBe("/view1");
//   });


//   describe('view1', function() {

//     beforeEach(function() {
//       browser().navigateTo('#/view1');
//     });


//     it('should render view1 when user navigates to /view1', function() {
//       expect(element('[ng-view] p:first').text()).
//         toMatch(/partial for view 1/);
//     });

//   });


//   describe('view2', function() {

//     beforeEach(function() {
//       browser().navigateTo('#/view2');
//     });


//     it('should render view2 when user navigates to /view2', function() {
//       expect(element('[ng-view] p:first').text()).
//         toMatch(/partial for view 2/);
//     });

//   });
// });
