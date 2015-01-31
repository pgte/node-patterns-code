var initCouch = require('./init_couch');

initCouch(function(err) {
  if (err) {
    throw err
  }
  else {
    console.log('couchdb initialized');
  }
});