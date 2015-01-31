var users = require('./db/users');

var user = {
  _id: 'whaa@example.com',
  _rev: process.argv[2],
  username: 'johndoe',
  email: 'whaa@example.com',
  access_token: 'some access token'
};

users.update(user, function(err) {
  if (err) {
    console.error(err);
  }
  else {
    console.log('user updated');
  }
});