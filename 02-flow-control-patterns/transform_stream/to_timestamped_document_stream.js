var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = JSONTransform;

function JSONTransform(options) {
  if ( ! (this instanceof JSONTransform))
    return new JSONTransform(options);

  if (! options) options = {};
  options.objectMode = true;
  Transform.call(this, options);
}

inherits(JSONTransform, Transform);

JSONTransform.prototype._transform = function _transform(temperature, encoding, callback) {
  this.push({when: Date.now(), temperature: temperature});
  callback();
};