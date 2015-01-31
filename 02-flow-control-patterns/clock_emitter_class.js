var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = Clock;

function Clock() {
  if (! (this instanceof Clock)) return new Clock();

  this._started = false;

  EventEmitter.call(this);
}

inherits(Clock, EventEmitter);

Clock.prototype.start = function start() {
  var self = this;

  if (self._started) return;

  var tic = true;

  this._started = Date.now();

  self._interval = setInterval(function() {
    var event = tic ? 'tic' : 'toc';
    self.emit(event, self.time());
    tic = ! tic;
  }, 1000);
};

Clock.prototype.stop = function stop() {
  clearInterval(this._interval);
  this._started = false;
};

Clock.prototype.time = function() {
  return this._started && Date.now() - this._started;
};