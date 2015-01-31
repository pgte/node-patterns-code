var DistributedEmitter = require('./distributed_emitter');

var emitter1 = DistributedEmitter();
var emitter2 = DistributedEmitter();

var channels = ['channel 1', 'channel 2'];

channels.forEach(function(channel) {
  emitter1.on(channel, function(msg) {
    console.log('%s message:', channel, msg);
  });
});

channels.forEach(function(channel) {
  setInterval(function() {
    emitter2.emit(channel, {time: Date.now()});
  }, 1e3);
});
