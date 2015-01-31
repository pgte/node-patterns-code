var redis = require('./redis');

exports.score = score;

function score(game, player, diff, cb) {
  redis.zincrby(key(game), diff, player, cb);
}

exports.rank = rank;

function rank(game, cb) {
  redis.zrevrange(key(game), 0, -1, "WITHSCORES", function(err, ret) {
    if (err) {
      cb(err);
    }
    else {
      var rank = [];
      for (var i = 0 ; i < ret.length ; i += 2) {
        rank.push({player: ret[i], score: ret[i+1]});
      }
      cb(null, rank);
    }
  });
}

function key(game) {
  return 'game:' + game;
}