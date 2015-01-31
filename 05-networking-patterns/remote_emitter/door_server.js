var net = require('net');
var DuplexEmitter = require('duplex-emitter');
var door = require('./door');

var server = net.createServer();

server.on('connection', handleConnection);

server.listen(8000, function() {
  console.log('door server listening on %j', server.address());
});


/// store door state

var open = false;
var lastEventTime;

door.on('open', onOpen);
door.on('close', onClose);

function onOpen(time) {
  open = true;
  lastEventTime = time;
}

function onClose(time) {
  open = false;
  lastEventTime = time;
}


// handle connections

var nextId = 0;
var emitters = {};

function handleConnection(conn) {
  var remoteEmitter = DuplexEmitter(conn);
  var id = ++ nextId;
  emitters[id] = remoteEmitter;

  conn.once('close', onClose);
  conn.on('error', onError);

  if (lastEventTime) {
    remoteEmitter.emit(open ? 'open' : 'close', lastEventTime);
  }

  function onClose() {
    delete emitters[id];
  }

  function onError(err) {
    console.error('Error on connection: ' + err.message);
  }
}


/// broadcast door events

door.on('open', broadcast('open'));
door.on('close', broadcast('close'));

function broadcast(event) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(event);

    Object.keys(emitters).forEach(function(emitterId) {
      var emitter = emitters[emitterId];
      emitter.emit.apply(emitter, args);
    });

  };
}