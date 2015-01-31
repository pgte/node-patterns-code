var EventEmitter = require('events').EventEmitter;

var thermometer = new EventEmitter();

module.exports = thermometer;

function emitLater() {
  setTimeout(function() {

    thermometer.emit('reading', Math.random() * 20, 'C');

    emitLater();

  }, Math.floor(Math.random() * 5000));
}

emitLater();