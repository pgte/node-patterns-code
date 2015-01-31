var users = require('./db/users');

var userDiff = {
  _id: 'whaa@example.com',
  access_token: 'some other access token'
};

users.updateDiff(userDiff, function(err) {
  if (err) {
    console.error(err);
  }
  else {
    console.log('user updated');
  }
});