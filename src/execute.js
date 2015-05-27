var fs    = require('fs');
var path  = require('path');
var glob  = require('glob');
var xml   = require('xmldom');
var xpath = require('xpath');

var COMMENT_NODE    = 8;
var TEXT_NODE       = 3;
var NAMESPACE_SVG   = 'http://www.w3.org/2000/svg';
var NAMESPACE_XLINK = 'http://www.w3.org/1999/xlink';

var _numberOfRemainingFiles = 0;
var _logger, _outputFile, _repository, _repositoryId, _viewbox;

/**
 * Adds a collection of nodes to the repository.
 *
 * @param  {String} filename
 * @param  {NodeList} nodeList
 */
function appendToRepository(filename, nodeList) {
  var container = _repository.createElement('g');
  var id = generateId(filename);

  _logger.debug('Constructing node [[ #%s ]]', id);
  container.setAttribute('id', id);

  // Import and wrap the nodes
  arrayify(nodeList).forEach(function(node) {
    var importedNode = _repository.importNode(node, true);
    container.appendChild(importedNode);
  });

  // Add a newline for readability
  _repository.documentElement.appendChild(_repository.createTextNode('\n  '));

  // Add the container to the repository
  _repository.documentElement.appendChild(container);
}

/**
 * Converts a NodeList into an array.
 *
 * @param  {NodeList} nodeList
 * @return {Node[]}
 */
function arrayify(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

/**
 * Invoked after each file gets processed; will squish the repository once there
 * are no more files.
 *
 * @param {String} filepath
 */
function didProcessSingleSvgFile(filepath) {
  --_numberOfRemainingFiles;

  if (_numberOfRemainingFiles <= 0) {
    commitRepository(_outputFile);
  }
}

/**
 * Parses a string of XML into a DOM Document.
 *
 * @param  {String} contents  String of valid XML
 * @return {Document}
 */
function generateDocument(contents) {
  var parser = new xml.DOMParser();
  return parser.parseFromString(contents.toString());
}

/**
 * Returns a suitable identifier for a given filename.
 *
 * @param  {String} filename
 * @return {String}
 */
function generateId(filename) {
  var output;

  // Remove the extension, whatever it may be
  output = path.basename(filename, path.extname(filename));

  // Remove anything else we might not want
  output = output
    .replace(/\W+/g, '-')   // Remove special characters
    .replace(/^icon-(?!$)/, '')  // Remove 'icon-' prefix
  ;

  return [_repositoryId, output].join('-');
}

/**
 * Create the XML document that will hold all of the SVGs.
 */
function initializeRepository() {
  _repository = new xml.DOMImplementation().createDocument();

  var root = _repository.createElement('svg');
  root.setAttribute('id', _repositoryId);
  root.setAttribute('viewBox', _viewbox);

  _repository.appendChild(root);
}

/**
 * Main operation (duh).
 *
 * @param {Object} config
 * @param {Object} loggerInstance
 */
function main(config, loggerInstance) {
  var pattern = config.sourcePattern;
  _outputFile = config.outputFile;
  _repositoryId = config.repositoryId;
  _viewbox = config.viewbox;
  _logger = loggerInstance;

  _logger.debug('Globbing files: [[ %s ]]', pattern);
  glob(pattern, function(_, files) {
    _numberOfRemainingFiles = files.length;

    if (_numberOfRemainingFiles) {
      initializeRepository();

      _logger.info('Found [[ %d ]] files to process', _numberOfRemainingFiles);
      files.forEach(processSingleSvgFile);
    } else {
      _logger.info('No source files found');
    }
  });
}

/**
 * Performs the entire process of extracting the contents of an SVG file into a single repository.
 *
 * @param  {String} filepath
 */
function processSingleSvgFile(filepath) {
  var filename = path.basename(filepath);
  fs.readFile(filepath, function(err, buffer) {
    var document = generateDocument(buffer);
    var svg = selectOne('/svg:svg', document);

    _logger.info('Processing [[ %s ]]', filepath);
    appendToRepository(filename, sanitize(svg.childNodes));

    didProcessSingleSvgFile(filepath);
  });
}

/**
 * Walk a tree of nodes and remove anything that may be undesirable.
 *
 * @param  {NodeList} nodeList
 * @return {NodeList}
 */
function sanitize(nodeList) {
  arrayify(nodeList).forEach(function (node) {
    if (node.childNodes) {
      sanitize(node.childNodes);
    }

    // Remove superfluous nodes
    switch (node.nodeType) {
      case COMMENT_NODE:  // Fall through
      case TEXT_NODE:     // Fall through
        node.parentNode.removeChild(node);
        return;
    }

    if (node.attributes) {
      node.removeAttribute('id');
      node.removeAttribute('style');
    }
  });

  return nodeList;
}

/**
 * Wrapper for performing an XPath query against an SVG document.
 *
 * @param  {String} query
 * @param  {Node} node
 * @return {Node[]}
 */
function select(query, node) {
  return xpath.useNamespaces({
    'svg':  NAMESPACE_SVG,
    'xlink': NAMESPACE_XLINK
  })(query, node);
}

/**
 * Shorthand for getting a single node back in an XPath query.
 *
 * @param  {String} query
 * @param  {Node} node
 * @return {Node}
 */
function selectOne(query, node) {
  return select(query, node)[0] || null;
}

/**
 * Writes the SVG repository to file.
 *
 * @return {String}
 */
function commitRepository(filepath) {

  // Add one more newline for readability
  _repository.documentElement.appendChild(_repository.createTextNode('\n'));

  var xml = _repository.toString();

  _logger.debug('About to write to [[ %s ]]', filepath);
  fs.writeFile(filepath, xml, function(error) {
    if (error) {
      _logger.error('Could not write to [[ %s ]]', filepath, error);
    } else {
      _logger.success('Wrote SVG repository to [[ ' + filepath + ' ]]');
    }
  });
}

module.exports = main;
