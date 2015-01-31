var cuid = require('cuid');
var Redis = require('redis');
var redis = require('./redis');
var EventEmitter = require('events').EventEmitter;

var popTimeout = 10;

exports.push = push;
exports.Worker = Worker;

function push(work, cb) {
  var id = cuid();
  var item = {
    work: work,
    created: Date.now(),
    id: id
  };

  redis.lpush('workqueue:in', JSON.stringify(item), function(err) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, id);
    }
  });
}

function Worker(fn) {
  var conn = Redis.createClient();

  setImmediate(next);

  var worker = new EventEmitter();
  worker.close = close;

  return worker;

  function next() {
    conn.brpoplpush('workqueue:in', 'workqueue:processing', popTimeout, popped);

    function popped(err, item) {
      if (err) {
        worker.emit('error', err);
      }
      else {
        if (item) {
          var parsed = JSON.parse(item);
          fn.call(null, parsed.work, parsed.id, workFinished);
        }
      }

      function workFinished() {
        conn.lrem('workqueue:processing', 1, item, poppedFromProcessing);
      }

      function poppedFromProcessing(err) {
        if(err) {
          worker.emit('error', err);
        }
        next();
      }
    }
  }

  function close() {
    conn.quit();
  }
}
