var net = require('net');
var DuplexEmitter = require('duplex-emitter');
var Mux = require('mux-demux');

var server = net.createServer();

server.on('connection', handleConnection);

server.listen(8000, function() {
  console.log('door server listening on %j', server.address());
});


// sensors

var sensors = [
  {
    name: 'door',
    events: ['open', 'close'],
    emitter: require('./door'),
    remotes: {},
    nextId: 0,
    lastEvent: undefined
  },
  {
    name: 'temperature',
    events: ['reading'],
    emitter: require('./thermometer'),
    remotes: {},
    nextId: 0,
    lastEvent: undefined
  },
];


// handle connections

function handleConnection(conn) {
  var mx = Mux();

  conn.on('error', onError);
  mx.on('error', onError);

  conn.pipe(mx).pipe(conn);

  sensors.forEach(attachSensor);

  function attachSensor(sensor) {
    var stream = mx.createWriteStream(sensor.name);
    var remoteEmitter = DuplexEmitter(stream);

    stream.once('close', onClose);
    stream.on('error', onError);
    mx.on('error', onError);

    // add remote to sensor remotes
    var id = ++ sensor.nextId;
    sensor.remotes[id] = remoteEmitter;

    if (sensor.lastEvent) {
      remoteEmitter.emit.apply(remoteEmitter, sensor.lastEvent);
    }

    function onClose() {
      delete sensor.remotes[id];
    }

  }

  function onError(err) {
    conn.destroy();
    console.error('Error on connection: ' + err.message);
  }

}


/// broadcast all sensor events to connections

sensors.forEach(function(sensor) {
  sensor.events.forEach(function(event) {

    // broadcast all events of type `event`
    sensor.emitter.on(event, broadcast(event, sensor.remotes));

    // store last event on `sensor.lastEvent`
    sensor.emitter.on(event, function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(event);
      sensor.lastEvent = args;
    });
  });
});

function broadcast(event, remotes) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(event);

    Object.keys(remotes).forEach(function(emitterId) {
      var remote = remotes[emitterId];
      remote.emit.apply(remote, args);
    });

  };
}