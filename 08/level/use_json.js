var level = require('level');
var path = require('path');
var assert = require('assert');

var dbPath = process.env.DB_PATH || path.join(__dirname, 'mydb');

var options = {
  keyEncoding: 'binary',
  valueEncoding: 'json'
};

var db = level(dbPath, options);

db.put(new Buffer([1, 2, 3]), { some: 'json' }, function(err) {
  if (err) {
    return console.error(err);
  }

  db.get(new Buffer([1, 2, 3]), function(err, value) {
    if (err) {
      return console.error(err);
    }

    assert.deepEqual(value, { some: 'json' });
    console.log(value);
  });
});
