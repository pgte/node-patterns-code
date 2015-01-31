var assert = require('assert');
var db = require('./db');

var batch = [
  {type: 'put', key: 'a', value: 'A'},
  {type: 'put', key: 'b', value: 'B'},
  {type: 'put', key: 'c', value: 'C'},
  {type: 'put', key: 'd', value: 'D'}
];

var index = 0;

db.batch(batch, function(err) {
  var stream;

  if (err) {
    console.error(err);
  }
  else {
    stream = db.createReadStream({gte: 'a', lte: 'd'});
    stream.on('data', onData);

    db.batch(batch.map(function(op) {
      return {type: op.type, key: op.key, value: 'other value'};
    }), function(err) {
      if (err) {
        console.error(err);
      }
      else {
        console.log('saved batch replacing with other value, resuming');
      }
    });
  }

});

function onData(record) {
  console.log('read: %j', record);
  assert.equal(record.value, batch[index ++].value);
}
