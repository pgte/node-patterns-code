var userSets = require('./user_sets');

userSets.add('admins', 'user1', function(err) {
  if (err) {
    throw err;
  }

  console.log('added user1 to group');

  ['user1', 'user2'].forEach(function(user) {
    userSets.belongs('admins', user, function(err, belongs) {
      if (err) {
        throw err;
      }

      console.log('%s belongs to group: %j', user, belongs);
    });
  });
});