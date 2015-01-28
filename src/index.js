/* eslint strict:0 */

var fs = require( "fs" )
  , path = require( "path" )

  , nsg = require( "node-sprite-generator" )
  , _ = require( "lodash" )
  , async = require( "async" )
  , wrench = require( "wrench" )

  , config = require( "./config" )

  , logger = null;


var _runSvgGenerator = function ( generatorConfig, cb ) {

};

var _generateSvg = function ( mimosaConfig ) {
  console.log("trying to run generateSvg");
  //call to runSpriteGenerator
};

var registerCommand = function ( program, retrieveConfig ) {
  program
    .command( "svg" )
    .option("-D, --mdebug", "run in debug mode")
    .option("-P, --profile <profileName>", "select a mimosa profile")
    .description( "Generate svg file for your Mimosa application" )
    .action( function( opts ){
      opts.buildFirst = false;
      retrieveConfig( opts, function( mimosaConfig ) {
        logger = mimosaConfig.log;
        _generateSvg( mimosaConfig );
      });
    });
};

module.exports = {
  registerCommand: registerCommand,
  defaults:        config.defaults,
  placeholder:     config.placeholder,
  validate:        config.validate
};
