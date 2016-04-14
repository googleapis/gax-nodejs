pathTemplate = require('../lib/path_template.js');

var assert = require('chai').assert;
describe('PathTemplate', function() {
  describe('#instantiate()', function () {
    it('should return 1', function () {
      assert.equal(1, pathTemplate.instantiate());
    });
  });
});
