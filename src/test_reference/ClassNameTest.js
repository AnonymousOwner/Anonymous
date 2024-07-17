var chai = require('chai');
var assert = chai.assert;

describe('addClass', function() {
  it('should add class into element', function() {
    var element = { className: '' };

    addClass(element, 'test-class');

    assert.equal(element.className, 'test-class');
  });  
  
  it('should not add a class which already exists in element');
});