var extend = require('util')._extend;
var messages = require('./db/messages');

var message = {
  from: 'someone@example.com',
  to: 'whaa@example.com',
  subject: 'Test 123',
  body: 'Test message body'
};

var count = 10;
var left = count;

for(var i = 1 ; i <= count ; i ++) {
  messages.create(message, created);
}

function created(err) {
  if (err) {
    throw err;
  }
  if (-- left == 0) {
    console.log('%d messages inserted', count);
  }
}
