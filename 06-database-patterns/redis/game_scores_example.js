var gameScores = require('./game_scores');

var room = 'room1';

setInterval(function() {
  var player = 'player' + Math.floor(Math.random() * 10);
  gameScores.score(room, player, Math.floor(Math.random() * 10), function(err) {
    if (err) {
      throw err;
    }
  });
}, 1e2);

setInterval(function() {
  gameScores.rank(room, function(err, ranks) {
    if (err) {
      throw err;
    }
    console.log('%s ranking:\n', room, ranks);
  });
}, 1e3);