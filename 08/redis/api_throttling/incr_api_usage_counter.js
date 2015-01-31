var redis = require('../redis');

var expirationSecs = 60;

module.exports = incrAPIUsageCounter;

function incrAPIUsageCounter(user, cb) {
  var key = 'api-usage-counter:' + user;
  redis.multi().
    incr(key).
    ttl(key).
    exec(callback);

  function callback(err, results) {
    if (err) {
      cb(err);
    }
    else {
      var newValue = results[0];
      var ttl = results[1];
      if (ttl == -1) {
        redis.expire(key, expirationSecs, expired);
      }
      else {
        cb(null, newValue);
      }
    }

    function expired(err) {
      if (err) {
        cb(err);
      }
      else {
        cb(null, newValue);
      }
    }
  }
}
