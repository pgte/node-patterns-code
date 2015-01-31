var DbWriteStream = require('./db_write_stream');
var db = DbWriteStream();

var Thermometer = require('./thermometer');
var thermomether = Thermometer();

thermomether.pipe(db);