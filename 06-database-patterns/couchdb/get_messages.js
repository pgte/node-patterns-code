var user = process.argv[2];

if (! user) {
  console.error('please specify user');
  return;
}

var start = Number(process.argv[3]) || Date.now();
var maxPerPage = Number(process.argv[4]) || 4;

var messages = require('./db/messages');

messages.countFor(user, function(err, count) {
  if (err) {
    throw err;
  }

  console.log('%s has a total of %d messages.', user, count);

  messages.getFor(user, start, maxPerPage, function(err, messages, next) {
    if (err) {
      throw err;
    }

    console.log('messages for user %s:', user);
    messages.forEach(printMessage);

    console.log('\nNext message ID is %s', next);
  });

  function printMessage(message) {
    console.log(message);
  }
});

