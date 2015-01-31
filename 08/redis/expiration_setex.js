var redis = require('./redis');

redis.setex('some key', 2, 'some value');

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