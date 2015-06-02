'use strict';

exports.defaults = function() {
  return {
    svgstore: {
      sourcePattern: 'assets/svgs/**/*.svg',
      outputFile:    'assets/svgs/repository.html',
      repositoryId:  '-svg-repository',
      viewBox:       '0 0 100 100'
    }
  };
};

exports.validate = function(config, validators) {
  var errors = [];

  if (validators.isObject(errors, 'svgstore config', config.svgstore)) {
    validators.isString(errors, 'svgstore.sourcePattern', config.svgstore.sourcePattern);
    validators.isString(errors, 'svgstore.outputFile', config.svgstore.outputFile);
    validators.isString(errors, 'svgstore.repositoryId', config.svgstore.repositoryId);
    validators.isString(errors, 'svgstore.viewBox', config.svgstore.viewBox);
  }

  return errors;
};
