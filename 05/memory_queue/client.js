var domotic = require('./domotic_queue');

for(var i = 0 ; i < 20; i ++) {
  domotic.command('toggle light', i, function(err) {
    if (err) throw err;
    console.log('command finished');
  });
}

domotic.disconnect();