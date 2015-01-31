var level = require('level');
var db = level('./db');

var Jobs = require('level-jobs');

var maxConcurrency = 1;
var queue = Jobs(db, worker, maxConcurrency);

module.exports = queue;

function worker(event, cb) {
  sendEventToRemoteService(event, function(err) {
    if (err) console.error('Error processing event %s: %s', event.id, err.message);
    else console.log('event %s successfully relayed', event.id);
    cb(err);
  });
}


function sendEventToRemoteService(event, cb) {
  setTimeout(function() {
    var err;
    if (Math.random() > 0.5) err = Error('something awful has happened');
    cb(err);
  }, 100);
}