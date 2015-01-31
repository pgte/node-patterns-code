var db = require('./sublevels');

var email = process.argv[2];

db.users.get(email, function(err, user) {
  if (err) {
    throw err;
  }
  console.log('User: %j', user);

  var userMessages = db.messages.sublevel(email);

  userMessages.createValueStream().on('data', function(message) {
    console.log('Message: %j', message);
  })
  .once('end', function() {
    console.log('no more messages');
  });
});