var Redis = require('redis');
var EventEmitter = require('events').EventEmitter;

module.exports = DistributedEmitter;

function DistributedEmitter() {

  // Redis stuff

  var redis = {
    pub: Redis.createClient(),
    sub: Redis.createClient()
  };

  redis.pub.unref();
  redis.sub.unref();

  redis.pub.on('error', onRedisError);
  redis.sub.on('error', onRedisError);

  redis.sub.on('message', function(channel, message) {
    old.emit.call(emitter, channel, JSON.parse(message));
  });

  // Emitter stuff

  var emitter = new EventEmitter();

  var old = {
    emit: emitter.emit,
    addListener: emitter.addListener,
    removeListener: emitter.removeListener
  };

  emitter.emit = function emit(channel, message) {
    redis.pub.publish(channel, JSON.stringify(message));
  };

  emitter.addListener = emitter.on = function addListener(channel, fn) {
    if (!emitter.listeners(channel).length) {
      subscribe(channel);
    }
    old.addListener.apply(emitter, arguments);
  };

  emitter.removeListener = function removeListener(channel, fn) {
    old.removeListener.apply(emitter, arguments);
    if (!emitter.listeners(channel).length) {
      unsubscribe(channel);
    }
  };

  emitter.close = function close() {
    redis.pub.quit();
    redis.sub.quit();
  };

  return emitter;

  function subscribe(channel) {
    redis.sub.subscribe(channel);
  }

  function unsubscribe(channel) {
    redis.sub.unsubscribe(channel);
  }

  function onRedisError(err) {
    emitter.emit('error', err);
  }
}
