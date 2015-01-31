exports.connect = connect;
exports.command = command;
exports.disconnect = disconnect;

function connect(cb) {
  setTimeout(cb, 100); // simulate connection
}

function command(cmd, options, cb) {
  if (succeeds()) {
    setTimeout(cb, 100); // simulate command
  } else {
    setTimeout(function() {
      var err = Error('error connecting');
      err.code = 'ECONN';
      cb(err);
    }, 100);
  }

}

function disconnect(cb) {
  if (cb) setTimeout(cb, 100); // simulate disconnection
}

function succeeds() {
  return Math.random() > 0.5;
}