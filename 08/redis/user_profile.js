var redis = require('./redis');

exports.set = setUserProfile;
exports.get = getUserProfile;

function setUserProfile(userId, profile, cb) {
  redis.hmset('profile:' + userId, profile, cb);
}

function getUserProfile(userId, cb) {
  redis.hgetall('profile:' + userId, cb);
}

var user = 'userid';
var profile = {
  name: 'John Doe',
  address: '31 Paper Street, Gotham City',
  zipcode: '987654',
  email: 'john.doe@example.com'
};

setUserProfile(user, profile, function(err) {
  if (err) {
    throw err;
  }
  console.log('saved user profile');
  getUserProfile(user, function(err, profile) {
    if (err) {
      throw err;
    }
    console.log('loaded user profile:', profile);
  });
});