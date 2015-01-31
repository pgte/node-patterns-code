var DbWriteStream = require('./db_write_stream');
var db = DbWriteStream();

var JSONEncodeStream = require('./json_encode_stream');
var json = JSONEncodeStream();

var ToTimestampedDocumentStream = require('./to_timestamped_document_stream');
var doc = ToTimestampedDocumentStream();

var Thermometer = require('../thermometer');

var thermometer = Thermometer();

thermometer.pipe(doc).pipe(json).pipe(db);
