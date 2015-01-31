module.exports = BaseLogger;
var extend = require('util')._extend;
var fs = require('fs');

const defaultOptions = {
  defaultLevel: 'info'
};

function BaseLogger(options) {
  if (! (this instanceof BaseLogger)) return new BaseLogger(options);

  var opts = extend({}, defaultOptions);
  this._options = extend(opts, options || {});
}


BaseLogger.prototype.log = function(what, level) {
  var date = new Date;
  var entry = {
    when: date.toJSON(),
    level: level || this._options.defaultLevel,
    what: what
  };

  this._log(entry);
};

BaseLogger.prototype.info = function(what) {
  this.log(what, 'info');
};

BaseLogger.prototype.warn = function(what) {
  this.log(what, 'warning');
};

BaseLogger.prototype.critical = function(what) {
  this.log(what, 'critical');
};