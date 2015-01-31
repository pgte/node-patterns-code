var redis = require('./redis');

redis.multi().
  set('key A', 'some value for A').
  get('key A').
  set('key A', 'some *OTHER* value for A').
  get('key A').
  exec(function(err, results) {
    if (err) {
      throw err;
    }
    console.log('terminated. results: %j', results);
    redis.quit();
  });