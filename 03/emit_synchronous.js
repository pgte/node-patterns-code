var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

emitter.on('beep', function() {
  console.log('beep');
});

emitter.on('beep', function() {
  console.log('beep again');
});


console.log('before emit');

emitter.emit('beep');

console.log('after emit');