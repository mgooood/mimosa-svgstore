var expect = require('chai').expect;
var linter = require('../src/linter');

const ELEMENT_NODE     = 1;
const DEFAULT_POINTS   = '0,0 1,1 0,1 1,0';
const POINTS_LONG      = '0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333';
const POINTS_LINEBREAK = '0.33,0.33\r\n\t0.33,0.33 0.33,0.33';
const COLUMN_NUMBER    = 112233;
const LINE_NUMBER      = 332211;

describe('linter#lint()', function() {
  var element, warnings;

  beforeEach(function setUp() {
    element = null;
    warnings = null;
  });

  it('accepts good polygon without false positives', function() {
    element = generatePolygon();
    warnings = linter.lint(element);
    expect(warnings).to.be.empty;
  });

  it('accepts good path without false positives', function() {
    element = generatePath();
    warnings = linter.lint(element);
    expect(warnings).to.be.empty;
  });

  it('catches long `d` attribute', function() {
    element = generatePolygon(POINTS_LONG);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.match(/attribute `points` is longer than \d+/);
    expect(warnings[0]).to.contain(element.lineNumber + 1);
    expect(warnings[0]).to.contain(element.columnNumber);
  });

  it('catches long `path` attribute', function() {
    element = generatePath(POINTS_LONG);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.match(/attribute `d` is longer than \d+/);
    expect(warnings[0]).to.contain(element.lineNumber + 1);
    expect(warnings[0]).to.contain(element.columnNumber);
  });

  it('catches line breaks in `d` attribute', function() {
    element = generatePath(POINTS_LINEBREAK);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.contain('<path/> attribute `d` contains line breaks (ln 332212:112233)');
  });

  it('catches line breaks in `points` attribute', function() {
    element = generatePolygon(POINTS_LINEBREAK);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.contain('<polygon/> attribute `points` contains line breaks (ln 332212:112233)');
  });

  it('catches `display = none` attribute', function() {
    element = generateElement('rect', { display: 'none' });
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.equal('<rect/> attribute `display` eq `none` (ln 332212:112233)');
  });

  it('catches <style/> tag', function() {
    element = generateElement('style');
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.equal('<style/> tag detected (ln 332212:112233)');
  });
});

///
/// Helpers
///

function generateElement(tagName, attrs) {
  return {
    attributes:   attrs || {},
    columnNumber: COLUMN_NUMBER,
    lineNumber:   LINE_NUMBER,
    nodeType:     ELEMENT_NODE,
    tagName:      tagName.toLowerCase(),
    getAttribute: function (key) {
      return this.attributes[key] || '';
    }
  };
}

function generatePath(d) {
  return generateElement('path', {
    d: d || DEFAULT_POINTS
  });
}

function generatePolygon(points) {
  return generateElement('polygon', {
    points: points || DEFAULT_POINTS
  });
}
