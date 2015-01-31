var path = require('path');
var level = require('level');

var dbPath = process.env.DB_PATH || path.join(__dirname, 'bookface');
var db = level(dbPath, {
  valueEncoding: 'json'
});

var batch = [];

var users = require('./users');

users.forEach(function(user) {
  batch.push({
    type: 'put',
    key: user.email,
    value: {
      email: user.email,
      createdAt: new Date
    }
  });

  user.friends.forEach(function(friend) {
    batch.push({
      type: 'put',
      key: user.email + '!friendships!' + friend,
      value: {
        source: user.email,
        target: friend,
        createdAt: new Date
      }
    })
  });
});

db.batch(batch, function(err) {
  if (err) {
    throw err;
  }

  console.log('populated successfully');

});