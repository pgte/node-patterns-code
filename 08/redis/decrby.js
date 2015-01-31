var redis = require('./redis');

for(var i = 0 ; i < 10 ; i ++) {
  redis.decrby('some other key', 2, done);
}

function done(err, result) {
  if (err) {
    throw err;
  }
  console.log('new value:', result);
  redis.quit();
}