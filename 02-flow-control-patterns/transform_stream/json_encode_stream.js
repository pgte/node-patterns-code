var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = JSONEncode;

function JSONEncode(options) {
  if ( ! (this instanceof JSONEncode))
    return new JSONEncode(options);

  if (! options) options = {};
  options.objectMode = true;
  Transform.call(this, options);
}

inherits(JSONEncode, Transform);

JSONEncode.prototype._transform = function _transform(obj, encoding, callback) {
  try {
    obj = JSON.stringify(obj);
  } catch(err) {
    return callback(err);
  }

  this.push(obj);
  callback();
};