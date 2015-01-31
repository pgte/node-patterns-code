var db = require('./db');

db.put('key 1', 'value 1');
db.put('key 2', 'value 2');

db.get('key 1', function(err, value) {
  if (err) {
    return handleError(err);
  }
  console.log('value:', value);
});

db.del('key 1');

function handleError(err) {
  console.error(err);
}