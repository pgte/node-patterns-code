module.exports = Logger;
var extend = require('util')._extend;
var fs = require('fs');

const defaultOptions = {
  path: '/tmp/log.txt',
  defaultLevel: 'info'
};

function Logger(options) {
  var self = log;

  var opts = extend({}, defaultOptions);
  opts = extend(opts, options || {});

  var file = fs.createWriteStream(opts.path);

  function log(what, level) {
    var date = new Date;
    var entry = {
      when: date.toJSON(),
      level: level || opts.defaultLevel,
      what: what
    };

    file.write(JSON.stringify(entry) + '\n');
  };

  self.info = function(what) {
    log(what, 'info');
  };

  self.warn = function(what) {
    log(what, 'warning');
  };

  self.critical = function(what) {
    log(what, 'critical');
  };

  return self;
}