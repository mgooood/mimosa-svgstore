var path = require( "path" )
  , fs = require( "fs" )
  , mod = require( path.join( process.cwd(), "src", "index" ) )
  , generateSvg = mod.generateSvg
  ;

describe("when generateSvg is invoked", function() {

  it("will output nothing if there are no .svg files", function(){
    generateSvg({});
  });


  describe("when creating SVG output", function() {

    describe("with one folder", function() {

      it("will create proper output .svg with one input file", function() {
        var mimosaConfig ={

        };

        generateSvg({});


      });

      it("will create proper output .svg with multiple input files", function() {

      });

    });


    describe("with multiple folders", function() {

      it("will create proper output .svg with one input file", function() {

      });

    });

  });

});
