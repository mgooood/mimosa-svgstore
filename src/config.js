'use strict';

exports.defaults = function() {
  return {
    svgstore: {
      sourcePattern: 'svg/**/*.svg',
      outputFile:    'svg/repository.html'
    }
  };
};

exports.validate = function(config, validators) {
  var errors = [];

  if (validators.isObject(errors, 'svgstore config', config.svgstore)) {
    validators.isString(errors, 'svgstore.sourcePattern', config.svgstore.sourcePattern);
    validators.isString(errors, 'svgstore.outputFile', config.svgstore.outputFile);
  }

  return errors;
};
