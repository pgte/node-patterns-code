var redis = require('./redis');
var assert = require('assert');

redis.set('key', 'value', function(err) {
  if (err) {
    throw err
  }

  redis.get('key', function(err, value) {
    if (err) {
      throw err
    }

    assert.equal(value, 'value');

    console.log('it works!');

    redis.quit();
  });
});