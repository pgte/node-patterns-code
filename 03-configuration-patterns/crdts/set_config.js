var argv = process.argv.slice(2);

var keySpec = argv[0].split(':');
console.log(keySpec);
var id = keySpec[0];
var key = keySpec[1];

var value = argv[1];

var config = require('./node_config');

console.log('setting %s:%s = %s', id, key, value);
var row = config.get(id);
row.set(key, value);
