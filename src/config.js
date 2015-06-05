'use strict';

exports.defaults = function() {
  return {
    svgstore: {
      sourcePattern: 'assets/svgs/**/*.svg',
      outputFile:    'assets/svgs/repository.html',
      repositoryId:  '-svg-repository'
    }
  };
};

exports.validate = function(config, validators) {
  var errors = [];

  if (validators.isObject(errors, 'svgstore config', config.svgstore)) {
    validators.isString(errors, 'svgstore.sourcePattern', config.svgstore.sourcePattern);
    validators.isString(errors, 'svgstore.outputFile', config.svgstore.outputFile);
    validators.isString(errors, 'svgstore.repositoryId', config.svgstore.repositoryId);
  }

  return errors;
};
