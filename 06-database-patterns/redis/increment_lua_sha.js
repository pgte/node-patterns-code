var redis = require('./redis');
var luaScripts = require('./lua_scripts');

function increment(key, cb) {
  luaScripts.execute(redis, 'increment', 1, key, cb);
}

for(var i = 0 ; i < 10 ; i ++) {
  increment('some key', function(err, newValue) {
    if (err) {
      throw err;
    }
    console.log('successfully set new value to %j', newValue);
    redis.quit();
  });
}