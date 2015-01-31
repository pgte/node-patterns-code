var Redis = require('redis');
var redis = require('./redis');

var popTimeout = 10;

exports.push = push;
exports.Worker = worker;

function push(work, cb) {
  redis.lpush('workqueue', JSON.stringify(work), cb);
}

function worker(fn) {
  var conn = Redis.createClient();

  next();

  function next() {
    conn.brpop('workqueue', popTimeout, popped);

    function popped(err, results) {
      if (err) {
        cb(err);
      }
      else {
        var work = results[1];
        if (work) {
          fn(null, JSON.parse(work));
        }
      }
      next();
    }
  }

  function close() {
    conn.quit();
  }

  return {
    close: close
  };
}
