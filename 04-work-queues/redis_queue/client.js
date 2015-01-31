var Queue = require('simple-redis-safe-work-queue')

var queueClient = Queue.client('invoke webhook');

queueClient.push({
  url: 'http://example.com',
  method: 'POST',
  json: {
    a: 1,
    b: 2
  }
});

queueClient.stop();