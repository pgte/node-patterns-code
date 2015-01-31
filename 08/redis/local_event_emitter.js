var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

emitter.on('some event', function() {
  console.log('some event happened');
});

emitter.emit('some event');