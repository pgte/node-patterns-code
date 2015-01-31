var async = require('async');
var Backoff = require('backoff');
var domotic = require('./domotic');

var connected = false;

var queue = async.queue(work, 1);


function work(item, cb) {
  ensureConnected(function() {
    domotic.command(item.command, item.options, callback);
  });

  function callback(err) {
    if (err && err.code == 'ECONN') {
      connected = false;
      work(item, cb);
    } else {
      cb(err);
    }
  }
}


/// command

exports.command = pushCommand;


function pushCommand(command, options, cb) {
  var work = {
    command: command,
    options: options
  };

  console.log('pushing command', work);

  queue.push(work, cb);
}

function ensureConnected(cb) {
  if (connected) {
    return cb();
  } else {
    var backoff = Backoff.fibonacci();
    backoff.on('backoff', connect);
    backoff.backoff();
  }

  function connect() {
    domotic.connect(connected);
  }

  function connect(err) {
    if (err) {
      backoff.backoff();
    } else {
      connected = true;
      cb();
    }
  }
}


/// disconnect

exports.disconnect = disconnect;

function disconnect() {
  if (! queue.length()) {
    domotic.disconnect();
  } else {
    console.log('waiting for the queue to drain before disonnecting');
    queue.drain = function() {
      console.log('disconnecting');
      domotic.disconnect();
    };
  }
}