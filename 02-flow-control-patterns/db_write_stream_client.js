var DbWriteStream = require('./db_write_stream');
var db = DbWriteStream();

var Thermometer = require('./thermometer');

var thermomether = Thermometer();

thermomether.on('data', function(temp) {
  db.write({when: Date.now(), temperature: temp});
});