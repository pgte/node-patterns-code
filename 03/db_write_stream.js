var Writable = require('stream').Writable;
var util = require('util');

module.exports = DatabaseWriteStream;

function DatabaseWriteStream(options) {
  if (! (this instanceof DatabaseWriteStream))
    return new DatabaseWriteStream(options);
  if (! options) options = {};
  options.objectMode = true;
  Writable.call(this, options);
}

util.inherits(DatabaseWriteStream, Writable);

DatabaseWriteStream.prototype._write = function write(doc, encoding, callback) {
  insertIntoDatabase(JSON.stringify(doc), callback);
};

function insertIntoDatabase(doc, cb) {
  setTimeout(cb, 10);
}