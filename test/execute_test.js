var fs      = require('fs');
var path    = require('path');
var expect  = require('chai').expect;
var execute = require('../src/execute');

const SOURCE_PATTERN = 'test/fixtures/input/**/*.svg';
const OUTPUT_FILE    = 'test/fixtures/output/test-repository.html';
const REPOSITORY_ID  = 'test-repo-id';
const VIEW_BOX       = '0 0 9001 9001';

describe('execute#main()', function () {
  var config, logger;

  beforeEach(function setUp() {
    config = generateConfig();
    logger = generateLogger();
    removeOutputFile();
  });

  afterEach(function tearDown() {
    removeOutputFile();
  });

  it('operates normally', function (done) {
    execute(config, logger, function() {
      var logs = logger.playback();
      var lastLog = logs[logs.length - 1];
      var errors = logs.filter(_onlyErrors);
      var xml = fs.readFileSync(OUTPUT_FILE);

      expect(errors).to.be.empty;
      expect(lastLog.op).to.equal('success');
      expect(xml).to.contain(REPOSITORY_ID);
      expect(xml).to.contain(VIEW_BOX);
      expect(xml).to.contain('id="test-repo-id-alpha"');
      expect(xml).to.contain('id="test-repo-id-bravo"');
      expect(xml).to.contain('id="test-repo-id-charlie"');

      done();
  });
  });

  it('handles bad XML gracefully', function () {
    expect(true).to.be.false;
    });

});

///
/// Helpers
///

function _onlyErrors(log) {
  return log.op === 'error';
}

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
    error: function () {
      this._record('error', arguments);
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

function removeOutputFile() {
  try {
    fs.unlinkSync(OUTPUT_FILE);
  } catch(e) {}
}
