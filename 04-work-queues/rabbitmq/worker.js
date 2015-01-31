var Channel = require('./channel');

var queue = 'queue';

Channel(queue, function(err, channel, conn) {
  if (err) {
    console.error(err.stack);
  }
  else {
    console.log('channel and queue created');
    consume();
  }

  function consume() {
    channel.get(queue, {}, onConsume);

    function onConsume(err, msg) {
      if (err) {
        console.warn(err.message);
      }
      else if (msg) {
        console.log('consuming %j', msg.content.toString());
        setTimeout(function() {
          channel.ack(msg);
          consume();
        }, 1e3);
      }
      else {
        console.log('no message, waiting...');
        setTimeout(consume, 1e3);
      }
    }
  }
});