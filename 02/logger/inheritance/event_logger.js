var fs = require('fs');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var BaseLogger = require('./base_logger');

module.exports = EventLogger;

inherits(EventLogger, BaseLogger);

function EventLogger(options) {
  if (! (this instanceof EventLogger)) return new EventLogger(options);
  BaseLogger.call(this, options);
  this.emitter = new EventEmitter;
}

EventLogger.prototype._log = function(entry) {
  this.emitter.emit('log', entry);
};