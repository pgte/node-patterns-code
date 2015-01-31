var cuid = require('cuid');
var db = require('./sublevels');

var user = {
  name: 'John',
  email: 'user1@example.com'
};

db.users.put(user.email, user, function() {
  for(var i = 1 ; i <= 20; i ++) {
    var userMessages = db.messages.sublevel(user.email);
    userMessages.put(cuid(), {
      from: 'user' + i + '@example.com',
      to: 'user1@example.com',
      subject: 'Hey!',
      body: 'hey there, how you doing?'
    });
  }
});