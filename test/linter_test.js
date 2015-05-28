/* global mocha */
var path       = require('path');
var expect     = require('chai').expect;

var linter = require(path.resolve(__dirname, '../src/linter'));

const POLYGON_GOOD = '0,0 1,1 0,1 1,0';
const POLYGON_LONG = '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001 ' +
                     '0.000000001,0.000000001 0.000000001,0.000000001';
const POLYGON_LINEBREAK = POLYGON_LONG.replace(/ /g, '\n\t');

describe('linter#lint()', function() {
  var element, warnings;

  beforeEach(function setUp() {
    element = null;
    warnings = null;
  });

  it('accepts good polygon without false positives', function() {
    element = generatePolygon('0,0 1,1 0,1 1,0');
    warnings = linter.lint(element);

    expect(warnings).to.have.length(0);
  });

  it('accepts good path without false positives', function() {
    element = generatePath('0,0 1,1 0,1 1,0');
    warnings = linter.lint(element);

    expect(warnings).to.have.length(0);
  });

  it('catches long `d` attribute', function() {
    element = generatePolygon();

    warnings = linter.lint(element);

    expect()
  });

  it('catches long `path` attribute', function() {

  });

  it('catches linebreaks in `d` attribute', function() {
    element = generatePath('M0,0\n1,1');

  });

  it('catches linebreaks in `points` attribute', function() {
    element = generatePolygon('0,0\n\t1,1 0,1 1,0');

  });

  it('catches `display = none` attribute', function() {

  });

  it('catches <style/> tag', function() {

  });
});

function generateElement(tagName, attrs) {
  return {
    attributes:   attrs,
    tagName:      tagName.toLowerCase(),
    getAttribute: function(key) {
      return JSON.stringify(attrs[key]);
    }
  };
}

function generatePolygon(d) {
  return generateElement('polygon', {
    d: d || '0,0 1,1 0,1 1,0'
  });
}

