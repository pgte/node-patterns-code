var FileLogger = require('./file_logger');
var EventLogger = require('./event_logger');

var fileLog = FileLogger();
var eventLog = EventLogger();

eventLog.emitter.on('log', function(entry) {
  console.log('log emitter emitted %j', entry);
});

fileLog.critical('very critical');
eventLog.warn('such warning');

