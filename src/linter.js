const PATH     = 'path';
const POLYGON  = 'polygon';
const STYLE    = 'style';
const BIG_ATTR = 200;

const CDATA_SECTION_NODE = 4;

const TEMPLATE_ATTR_DISPLAY_NONE   = '<{tag}/> attribute `display` eq `none` (ln {position})';
const TEMPLATE_ATTR_IS_LONG        = '<{tag}/> attribute `{attr}` is longer than {threshold} (ln {position})';
const TEMPLATE_ATTR_HAS_LINEBREAKS = '<{tag}/> attribute `{attr}` contains line breaks (ln {position})';
const TEMPLATE_CDATA               = '<![CDATA[]]> tag detected (ln {position})';
const TEMPLATE_STYLE_TAG           = '<style/> tag detected (ln {position})';

/**
 * Processes a single node for things I assume would be problems at scale.
 * Key word there is assume. :)
 *
 * @param {Node} node  Any node
 * @returns {String[]}  An array of warnings
 */
function lint(node) {
  var warnings = [];
  var position = [node.lineNumber + 1, node.columnNumber].join(':');

  function _attribute(key, threshold) {
    var value = node.getAttribute(key);

    if (value.length > threshold) {
      warnings.push(TEMPLATE_ATTR_IS_LONG
        .replace('{tag}', node.tagName)
        .replace('{attr}', key)
        .replace('{threshold}', threshold)
        .replace('{position}', position));
    }

    if (value.indexOf('\n') !== -1) {
      warnings.push(TEMPLATE_ATTR_HAS_LINEBREAKS
        .replace('{tag}', node.tagName)
        .replace('{attr}', key)
        .replace('{position}', position));
    }
  }

  if (node.nodeType === CDATA_SECTION_NODE) {
    warnings.push(TEMPLATE_CDATA
      .replace('{position}', position));
  }

  var tag = (node.tagName || '').trim().toLowerCase();
  switch (tag) {
    case STYLE:
      warnings.push(TEMPLATE_STYLE_TAG
        .replace('{position}', position));
      break;

    case POLYGON:
      _attribute('points', BIG_ATTR);
      break;

    case PATH:
      _attribute('d', BIG_ATTR);
      break;
  }

  if (node.attributes && node.getAttribute('display') === 'none') {
    warnings.push(TEMPLATE_ATTR_DISPLAY_NONE
      .replace('{tag}', node.tagName)
      .replace('{position}', position));
  }

  return warnings;
}


exports.lint = lint;
