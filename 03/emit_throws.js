var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

emitter.on('beep', function() {
  console.log('beep');
});

emitter.on('beep', function() {
  throw Error('oops!');
});

emitter.on('beep', function() {
  console.log('beep again');
});


console.log('before emit');

try {
  emitter.emit('beep');
} catch(err) {
  console.error('caught while emitting:', err.message);
}


console.log('after emit');