var Readable = require('stream').Readable;
var util = require('util');

module.exports = Thermometer;

function Thermometer(options) {
  if (! (this instanceof Thermometer)) return new Thermometer(options);
  if (! options) options = {};
  options.objectMode = true;
  Readable.call(this, options);
}

util.inherits(Thermometer, Readable);

Thermometer.prototype._read = function read() {
  console.log('read');
  var self = this;

  getTemperatureReadingFromThermometer(function(err, temperature) {
    if (err) self.emit('error', err);
    else self.push(temperature);
  });
};

function getTemperatureReadingFromThermometer(cb) {
  setTimeout(function() {
    cb(null, Math.random() * 20);
  }, 10);
}