var fs = require('fs');
var path = require('path');
var redis = require('./redis');

var script = fs.readFileSync(
  path.join(__dirname, 'lua_scripts', 'increment.lua'),
  {encoding: 'utf8'});

function increment(key, cb) {
  redis.eval(script, 1, key, cb);
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
