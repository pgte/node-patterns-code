var redis = require('./redis');

exports.add = add;

function add(group, member, cb) {
  redis.sadd(key(group), member, cb);
}

exports.remove = remove;

function remove(group, member, cb) {
  redis.srem(key(group), member, cb);
}

exports.belongs = belongs;

function belongs(group, member, cb) {
  redis.sismember(key(group), member, function(err, belongs) {
    cb(err, belongs == 1);
  });
}

function key(group) {
  return 'group:' + group;
}
