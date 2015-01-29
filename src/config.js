/* eslint strict:0 */
"use strict";

//var path = require( "path" ),
//    fs = require( "fs" );

exports.defaults = function() {
  return {
    svg: {
      inDir: "svg/icons",
      outDir: "svg",
      options: {}
    }
  };
};

exports.placeholder = function () {
   var ph = "SVG placeholder stuff";
  return ph;
};

exports.validate = function ( config, validators ) {
  var errors = [];


  return errors;
};
