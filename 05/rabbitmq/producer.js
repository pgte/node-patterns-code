var Channel = require('./channel');

var queue = 'queue';

Channel(queue, function(err, channel, conn) {
  if (err) {
    console.error(err.stack);
  }
  else {
    console.log('channel and queue created');
    var work = 'make me a sandwich';
    channel.sendToQueue(queue, encode(work), {
      persistent: true
    });
    setImmediate(function() {
      channel.close();
      conn.close();
    });
  }
});


function encode(doc) {
  return new Buffer(JSON.stringify(doc));
}
