var DistributedEmitter = require('./distributed_emitter');

var emitter = DistributedEmitter();

emitter.on('some event', function() {
  console.log('some event happened');
});

emitter.emit('some event', 'some payload');