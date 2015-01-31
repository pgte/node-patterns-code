var inherits = require('util').inherits;
var Transform = require('stream').Transform;

module.exports = CapitalizingTransformStream;

function CapitalizingTransformStream(options) {
  Transform.call(this, options);
}

inherits(CapitalizingTransformStream, Transform);


// _transform

CapitalizingTransformStream.prototype._transform = _transform;

function _transform(chunk, encoding, callback) {
  if (encoding == 'buffer') chunk = chunk.toString();
  callback(null, chunk.toUpperCase());
};