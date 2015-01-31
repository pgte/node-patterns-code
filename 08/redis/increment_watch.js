var Redis = require('redis');

function increment(key, cb) {
  var replied = false;
  var newValue;

  var redis = Redis.createClient();
  redis.once('error', done);
  redis.watch(key);

  redis.get(key, function(err, value) {
    if (err) {
      return done(err);
    }
    newValue = Number(value) + 1;
    redis.multi().
      set(key, newValue).
      exec(done);
  });

  function done(err, result) {
    redis.quit();

    if (! replied) {
      if (!err && !result) {
        err = new Error('Conflict detected');
      }

      replied = true;
      cb(err, newValue);
    }
  }
}

for(var i = 0 ; i < 10 ; i ++) {
  increment('A', function(err, newValue) {
    if (err) {
      throw err;
    }
    console.log('successfully set new value to %j', newValue);
  });
}
