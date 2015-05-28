var path    = require('path');
var expect  = require('chai').expect;
var execute = require('../src/execute');

const SOURCE_PATTERN = 'fixtures/input/**/*.svg';
const OUTPUT_FILE    = 'fixtures/output/repository.html';
const REPOSITORY_ID  = 'test-repo-id';
const VIEW_BOX       = '0 0 9001 9001';

describe('execute#main()', function () {
  var config, logger;

  beforeEach(function() {
    config = generateConfig();
    logger = generateLogger();
  });

  it('operates normally', function () {
    execute(config, logger);
    console.log(logger.playback());
    expect(true).to.be.false;
  });

  it('can handle not finding files', function () {
    expect(true).to.be.false;
  });

  it('handles output file in unwriteable directory', function () {
    expect(true).to.be.false;
  });

  it('handles bad XML gracefully', function () {
    expect(true).to.be.false;
  });

});

///
/// Helpers
///

function generateConfig() {
  return {
    sourcePattern: SOURCE_PATTERN,
    outputFile:    OUTPUT_FILE,
    repositoryId:  REPOSITORY_ID,
    viewBox:       VIEW_BOX
  };
}

function generateLogger() {
  return {
    _entries: [],
    _record: function (op, _arguments) {
      this._entries.push({
        op: op,
        args: [].slice.call(_arguments)
      });
    },
    debug: function () {
      this._record('debug', arguments);
    },
    info: function () {
      this._record('info', arguments);
    },
    log: function () {
      this._record('log', arguments);
    },
    playback: function () {
      return this._entries.slice();
    },
    success: function () {
      this._record('success', arguments);
    },
    warn: function () {
      this._record('warn', arguments);
    }
  };
}
