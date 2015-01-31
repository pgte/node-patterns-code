var fs = require('fs');
var inherits = require('util').inherits;

var BaseLogger = require('./base_logger');

module.exports = FileLogger;

inherits(FileLogger, BaseLogger);

const DEFAULT_PATH = '/tmp/log.txt';

function FileLogger(options) {
  if (! (this instanceof FileLogger)) return new FileLogger(options);
  BaseLogger.call(this, options);
  this._file = fs.createWriteStream(this._options.path || DEFAULT_PATH);
}

FileLogger.prototype._log = function(entry) {
  this._file.write(JSON.stringify(entry) + '\n');
};