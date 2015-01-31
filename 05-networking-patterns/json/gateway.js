var extend = require('util')._extend;
var inherits = require('util').inherits;
var Transform = require('stream').Transform;

module.exports = Gateway;

inherits(Gateway, Transform);

var defaultOptions = {
  highWaterMark: 10,
  objectMode: true
};

function Gateway(options) {
  if (! (this instanceof Gateway)) {
    return new Gateway(options);
  }

  options = extend({}, options || {});
  options = extend(options, defaultOptions);

  Transform.call(this, options);
}


/// _transform

Gateway.prototype._transform = _transform;

function _transform(event, encoding, callback) {
  if (! event.id)
    return handleError(new Error('event doesn\'t have an `id` field'));

  pushToQueue(event, pushed);

  function pushed(err) {
    if (err) {
      handleError(err);
    }
    else {

      reply = {
        id: event.id,
        success: true
      };

      callback(null, reply);
    }
  }

  function handleError(err) {
    var reply = {
      id: event.id,
      success: false,
      error: err.message
    };

    callback(null, reply);
  }
};


/// Fake push to queue

function pushToQueue(object, callback) {
  setTimeout(callback, Math.floor(Math.random() * 1000));
}