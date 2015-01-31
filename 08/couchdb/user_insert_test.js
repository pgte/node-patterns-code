var users = require('./db/users');

var user = {
  username: 'johndoe',
  email: 'whaa@example.com'
};

users.create(user, function(err) {
  if (err) {
    console.error(err);
  }
  else {
    console.log('user inserted');
  }
});