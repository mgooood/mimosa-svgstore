/* global mocha */
var path   = require('path');
var expect = require('chai').expect;
var utils  = require('./utils');

var linter = require(path.resolve(__dirname, '../src/linter'));

const POINTS_LONG      = '0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333 0.3333333333333,0.3333333333333';
const POINTS_LINEBREAK = '0.33,0.33\r\n\t0.33,0.33 0.33,0.33';
const LINE_NUMBER      = 123;
const COLUMN_NUMBER    = 321;

describe('linter#lint()', function() {
  var element, warnings;

  beforeEach(function setUp() {
    element = null;
    warnings = null;
  });

  it('accepts good polygon without false positives', function() {
    element = utils.generatePolygon();
    warnings = linter.lint(element);
    expect(warnings).to.be.empty;
  });

  it('accepts good path without false positives', function() {
    element = utils.generatePath();
    warnings = linter.lint(element);
    expect(warnings).to.be.empty;
  });

  it('catches long `d` attribute', function() {
    element = utils.generatePolygon(POINTS_LONG);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.match(/attribute `points` is longer than \d+/);
    expect(warnings[0]).to.contain(element.lineNumber + 1);
    expect(warnings[0]).to.contain(element.columnNumber);
  });

  it('catches long `path` attribute', function() {
    element = utils.generatePath(POINTS_LONG);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.match(/attribute `d` is longer than \d+/);
    expect(warnings[0]).to.contain(element.lineNumber + 1);
    expect(warnings[0]).to.contain(element.columnNumber);
  });

  it('catches line breaks in `d` attribute', function() {
    element = utils.generatePath(POINTS_LINEBREAK);
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.contain('<path/> attribute `d` contains line breaks (ln 332212:112233)');
  });

  it('catches line breaks in `points` attribute', function() {
    element = utils.generatePolygon('0,0\n\t1,1 0,1 1,0');
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.contain('<polygon/> attribute `points` contains line breaks (ln 332212:112233)');
  });

  it('catches `display = none` attribute', function() {
    element = utils.generateElement('rect', { display: 'none' });
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.equal('<rect/> attribute `display` eq `none` (ln 332212:112233)');
  });

  it('catches <style/> tag', function() {
    element = utils.generateElement('style');
    warnings = linter.lint(element);
    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.equal('<style/> tag detected (ln 332212:112233)');
  });
});
