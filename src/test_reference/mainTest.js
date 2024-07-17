var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;


describe('Main Return', function() {
  it('Needs integers to start', function(){
	  
	  expect(checkRadio('string')).to.be.a('string');

  });
});