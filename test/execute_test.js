var fs      = require('fs');
var path    = require('path');
var expect  = require('chai').expect;
var execute = require('../src/execute');

const PATTERN_NO_FILES    = 'lorem/ipsum/dolor/**/*.svg';
const PATTERN_BROKEN_FILE = 'test/fixtures/input/malformed.xml';
const PATH_UNWRITEABLE    = 'lorem/ipsum/dolor/cant-write-here.xml';
const SOURCE_PATTERN      = 'test/fixtures/input/**/*.svg';
const OUTPUT_FILE         = 'test/fixtures/output/test-repository.html';
const REPOSITORY_ID       = 'test-repo-id';

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
      var xml = fs.readFileSync(OUTPUT_FILE).toString();

      expect(errors).to.be.empty;
      expect(lastLog.op).to.equal('success');
      expect(xml).to.contain(REPOSITORY_ID);
      expect(xml).to.match(/<symbol id="[^"]+" viewBox="[^"]+">.+<\/symbol>/);
      expect(xml).to.contain('id="test-repo-id-alpha"');
      expect(xml).to.contain('id="test-repo-id-bravo"');
      expect(xml).to.contain('id="test-repo-id-charlie"');

      done();
    });
  });

  it('handles not finding files', function (done) {
    config.sourcePattern = PATTERN_NO_FILES;
    execute(config, logger, function() {
      var logs = logger.playback();
      var lastLog = logs[logs.length - 1];
      var errors = logs.filter(_onlyErrors);

      expect(errors).to.be.empty;
      expect(lastLog.op).to.equal('info');
      expect(lastLog.args.join()).to.equal('No source files found');

      done();
    });
  });

  it('handles bad XML without blowing up', function (done) {
    config.sourcePattern = PATTERN_BROKEN_FILE;
    execute(config, logger, function() {
      var logs = logger.playback();
      var lastLog = logs[logs.length - 1];
      var errors = logs.filter(_onlyErrors);
      var error = errors[0];

      expect(errors.length).to.equal(1);
      expect(error).to.exist;
      expect(error.args).to.include(PATTERN_BROKEN_FILE);
      expect(lastLog.op).to.equal('success');  // failure shouldn't derail the repo

      done();
    });
  });

  it('handles output file in unwriteable directory', function (done) {
    config.outputFile = PATH_UNWRITEABLE;
    execute(config, logger, function() {
      var logs = logger.playback();
      var lastLog = logs[logs.length - 1];
      var errors = logs.filter(_onlyErrors);
      var error = errors[0];

      expect(errors.length).to.equal(1);
      expect(error.args).to.include(PATH_UNWRITEABLE);
      expect(lastLog.op).to.equal('error');

      done();
    });
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
    repositoryId:  REPOSITORY_ID
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
