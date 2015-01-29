/* eslint strict:0 */
"use strict";

//var path = require( "path" ),
//    fs = require( "fs" );

exports.defaults = function() {
  return {
    svgstore: {
      inDir: "svg/icons",
      outDir: "svg",
      options: {}
    }
  };
};

exports.validate = function ( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "svgstore config", config.svgstore ) ) {

  }

  return errors;
};
