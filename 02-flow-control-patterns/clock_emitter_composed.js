var EventEmitter = require('events').EventEmitter;

module.exports = Clock;

function Clock() {
  var emitter = new EventEmitter();

  emitter.start = start;
  emitter.stop = stop;
  emitter.time = time;

  return emitter;
}

function start() {
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

function stop() {
  clearInterval(this._interval);
  this._started = false;
};

function time() {
  return this._started && Date.now() - this._started;
};