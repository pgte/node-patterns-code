var redis = require('./redis');

exports.push = push;
exports.pop = pop;

function push(work, cb) {
  redis.lpush('workqueue', JSON.stringify(work), cb);
}

function pop(cb) {
  redis.rpop('workqueue', function(err, work) {
    if (err) {
      cb(err);
    }
    else {
      if (work) {
        work = JSON.parse(work);
      }
      cb(null, work);
    }
  });
}