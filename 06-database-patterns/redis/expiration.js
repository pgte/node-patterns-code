var redis = require('./redis');

redis.set('some key', 'some value');
redis.expire('some key', 2);

setInterval(function() {
  redis.get('some key', function(err, value) {
    if (err) {
      throw err;
    }
    if (value) {
      console.log('value:', value);
    }
    else {
      console.log('value is gone');
      process.exit();
    }
  });
}, 1e3);