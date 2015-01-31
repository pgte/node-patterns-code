var couch = require('./couchdb');

couch.db.create('test2', function(err) {
  if (err && err.statusCode != 412) {
    console.error(err);
  }
  else {
    console.log('database test2 exists');
  }
});
