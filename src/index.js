/* eslint strict:0 */

var config = require( "./config"),
      
    logger = null;

var _runSvgGenerator = function ( generatorConfig, cb ) {

};

var generateSvg = function ( mimosaConfig ) {
  console.log("trying to run generateSvg");
  //call to runSpriteGenerator
};

var registerCommand = function ( program, retrieveConfig ) {
  program
    .command( "svgstore" )
    .option("-D, --mdebug", "run in debug mode")
    .option("-P, --profile <profileName>", "select a mimosa profile")
    .description( "Generate single svg file for a folder of .svgs" )
    .action( function( opts ){
      opts.buildFirst = false;
      retrieveConfig( opts, function( mimosaConfig ) {
        logger = mimosaConfig.log;
        generateSvg( mimosaConfig );
      });
    });
};

module.exports = {
  registerCommand: registerCommand,
  defaults: config.defaults,
  validate: config.validate,
  generateSvg: generateSvg
};
