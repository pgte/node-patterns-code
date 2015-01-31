var EventEmitter = require('events').EventEmitter;

var door = new EventEmitter();

module.exports = door;

var open = false;

function emitLater() {
  setTimeout(function() {

    open = ! open; // flip state
    var event = open ? 'open' : 'close';
    door.emit(event, Date.now());

    emitLater();

  }, Math.floor(Math.random() * 5000));
}

emitLater();