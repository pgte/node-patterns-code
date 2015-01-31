var redis = require('../redis');

var maxAPICallsPerUser = 100;

module.exports = canUserUseAPI;

function canUserUseAPI(user, cb) {
  var key = 'api-usage-counter:' + user;
  redis.get(key, function(err, value) {
    if (err) {
      cb(err);
    }
    else {
      var n = Number(value);
      var allowed = n <= maxAPICallsPerUser;
      cb(null, allowed);
    }
  });
}