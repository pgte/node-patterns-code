var redis = require('./redis');

exports.APIAccess = countAPIAccess;

function countAPIAccess(user, cb) {
  var now = new Date();
  var year = now.getUTCFullYear();
  var month = format(now.getUTCMonth()+1)
  var day = [year, month, now.getUTCDate()].join('-');

  var key = 'counters:' + user;

  redis.multi().
    hincrby(key, year, 1).
    hincrby(key, month, 1).
    hincrby(key, day, 1).
    hincrby(key, 'total', 1).
    exec(cb);
}

function format(n) {
  return ("0" + n).slice(-2);
}

countAPIAccess('some user id', function(err) {
  if (err) {
    throw err;
  }
  console.log('counted API access');
});