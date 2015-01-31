var config = require('./node_config');

setInterval(function() {
  console.log('config: %j', config.toJSON());
}, 1000);