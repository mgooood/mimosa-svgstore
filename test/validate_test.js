var path = require( "path" )
  , validators = require( "validatemimosa" )
  , config = require( path.join( process.cwd(), "src", "config" ) )
  ;

describe("when mimosa-svgstore validates its configuration", function() {

  it("will not return errors when the config is correct", function() {
    var mimosaConfig = {
      svgstore:{}
    };
    var errors = config.validate( mimosaConfig, validators );
    expect(errors.length).to.eql(0);
  });

  it("will return an error when svgstore is set to a non-object", function() {
    var mimosaConfig = {
      svgstore:false
    };
    var errors = config.validate( mimosaConfig, validators );
    expect(errors.length).to.eql(1);
  });
});