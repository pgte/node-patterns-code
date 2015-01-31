var path = require('path');
var level = require('level');

var dbPath = process.env.DB_PATH || path.join(__dirname, 'bookface');
var db = level(dbPath, {
  valueEncoding: 'json'
});

function user(email, cb) {
  db.get(email, cb);
}

function friendships(email) {
  var key = email + '!' + 'friendships!';
  return db.createValueStream({
    gte: key,
    lte: key + '\xff'
  });
}

var email = process.argv[2];

user(email, function(err, user) {
  console.log('got user:', user);
});

var friends = friendships(email).on('data', function(friend) {
  console.log('friend:', friend.target);
});

friends.once('end', function() {
  console.log('no more friends');
});
