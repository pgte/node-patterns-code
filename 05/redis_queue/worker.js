var request = require('request');
var Queue = require('simple-redis-safe-work-queue')

var worker = Queue.worker('invoke webhook', invokeWebhook);

function invokeWebhook(webhook, cb) {
  console.log('invoke webhook: %j', webhook);

  request(webhook, done);

  function done(err, res) {
    if (! err && (res.statusCode < 200 || res.statusCode >= 300)) {
      err = Error('response status code was ' + res.statusCode);
    }
    cb(err);
  }
}

worker.on('max retries', function(err, payload) {
  console.error(
    'max retries reached trying to talk to %s.: %s\nrequest params: %j',
    payload.url, err.stack, payload);
});