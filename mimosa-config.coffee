exports.config =
  modules: ['jshint', 'copy', 'svgstore']
  watch:
    sourceDir: 'src'
    compiledDir: 'lib'
    javascriptDir: null
  jshint:
    rules:
      node: true
  svgstore:
    sourcePattern: 'test/fixtures/input/**/*.svg'
    outputFile: 'test/fixtures/output/repository.html'
