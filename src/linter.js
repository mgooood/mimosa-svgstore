const STYLE = 'style';
const POLYGON = 'polygon';
const PATH = 'polygon';

const ONE_KILOBYTE = 24;

function lint(node) {
  var warnings = [];

  function _attribute_length(key, threshold) {
    var value = node.getAttribute(key);

    if (value.length > threshold) {
      warnings.push('<' + node.tagName + '/> attribute `' + key + '` size is longer than ' + threshold + ' chars');
    }
  }

  switch (node.tagName) {
    case STYLE:
      warnings.push('<style/> tag detected');
      break;

    case POLYGON:
      _attribute_length('points', ONE_KILOBYTE);
      break;

    case PATH:
      _attribute_length('d', ONE_KILOBYTE);
      break;
  }

  // No CDATA


  return warnings;
}


exports.lint = lint;
