var config = require('./config');
var execute = require('./execute');

/**
 * Generates a logger wrapper that prefixes the module name to log output.
 *
 * @param  {Object} logger The raw Mimosa logger
 * @return {Object}
 */
function generateLoggerProxy(logger) {
  var proxy = {};

  ['info', 'warn', 'success', 'error', 'debug'].forEach(function(level) {
    proxy[level] = function() {
      var fn = logger[level];
      var argsArray = Array.prototype.slice.call(arguments);
      argsArray[0] = 'mimosa-svgstore: ' + argsArray[0];

      return fn.apply(logger, argsArray);
    };
  });

  return proxy;
}

function registerCommand(program, logger, retrieveConfig) {
  var loggerProxy = generateLoggerProxy(logger);

  program
    .command('svgstore')
    .option('-D, --mdebug', 'run in debug mode')
    .description('Generate single svg file for a folder of .svgs')
    .action(function(options) {
      options.buildFirst = false;
      retrieveConfig(options, function(mimosaConfig) {
        execute(mimosaConfig.svgstore, loggerProxy);
      });
    });
}

module.exports = {
  defaults:        config.defaults,
  registerCommand: registerCommand,
  validate:        config.validate
};
