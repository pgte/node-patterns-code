var redis = require('./redis');

for(var i = 0 ; i < 10 ; i ++) {
  redis.decr('some key', done);
}

function done(err, result) {
  if (err) {
    throw err;
  }
  console.log('new value:', result);
  redis.quit();
}