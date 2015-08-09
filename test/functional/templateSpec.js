'use strict';
describe('a test template!', function(){

  beforeEach(function(){
    setupTestBackend({facade: true});
  });

  afterEach(function() {
    tearDownAndVerify();
  });

  describe("The main page", function(){
    beforeEach(function(){
      // visit('/patients/create');
      // getElements();
    });

    it("should let user know you're seeing all coupons", function(){
      // expect($view).toContainText('New Patient');
    });

    describe("entering info", function(){

      it("should validate first name", function(){
        // Do test stuff here.
      });
    });
  });  // The Main Page
});
