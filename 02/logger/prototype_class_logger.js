module.exports = Logger;
var extend = require('util')._extend;
var fs = require('fs');

const defaultOptions = {
  path: '/tmp/log.txt',
  defaultLevel: 'info'
};

function Logger(options) {
  if (! (this instanceof Logger)) return new Logger(options);

  var opts = extend({}, defaultOptions);
  this._options = extend(opts, options || {});
  this._file = fs.createWriteStream(opts.path);
}

Logger.prototype.log = function(what, level) {
  var date = new Date;
  var entry = {
    when: date.toJSON(),
    level: level || this._options.defaultLevel,
    what: what
  };

  this._file.write(JSON.stringify(entry) + '\n');
};

Logger.prototype.info = function(what) {
  this.log(what, 'info');
};

Logger.prototype.warn = function(what) {
  this.log(what, 'warning');
};

Logger.prototype.critical = function(what) {
  this.log(what, 'critical');
};