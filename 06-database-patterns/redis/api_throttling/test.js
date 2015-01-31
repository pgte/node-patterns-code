var incr = require('./incr_api_usage_counter');
incr('someuser', function(err, counter) {
  if (err) {
    throw err;
  }

  console.log('user has usage of', counter);
});