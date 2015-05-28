/* global mocha */
var path       = require('path');
var expect     = require('chai').expect;
var validators = require('validatemimosa');

var config = require(path.resolve(__dirname, '../src/config'));

describe('config', function() {

  describe('#defaults()', function() {
    it('returns an object', function() {
      var defaultConfiguration = config.defaults();
      expect(defaultConfiguration).to.be.an('object');
    });
  });

  describe('#validate()', function() {
    var mimosaConfig, errors;

    function validate() {
      return config.validate(mimosaConfig, validators);
    }

    beforeEach(function setup() {
      mimosaConfig = config.defaults();
      errors = null;
    });

    it('accepts defaults', function() {
      errors = validate();
      expect(errors).to.have.length(0);
    });

    it('throws when config is not object', function() {
      mimosaConfig.svgstore = null;

      errors = validate();
      expect(errors).to.have.length(1);
    });
  });
});
