const DEFAULT_POINTS = '0,0 1,1 0,1 1,0';
const COLUMN_NUMBER = 112233;
const LINE_NUMBER = 332211;

exports.generateElement = function (tagName, attrs) {
  return {
    attributes:   attrs || {},
    columnNumber: COLUMN_NUMBER,
    lineNumber:   LINE_NUMBER,
    tagName:      tagName.toLowerCase(),
    getAttribute: function (key) {
      return this.attributes[key] || '';
    }
  };
};

exports.generatePath = function (d) {
  return exports.generateElement('path', {
    d: d || DEFAULT_POINTS
  });
};

exports.generatePolygon = function (points) {
  return exports.generateElement('polygon', {
    points: points || DEFAULT_POINTS
  });
};
