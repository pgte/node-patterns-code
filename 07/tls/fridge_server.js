var fs = require('fs');
var tls = require('tls');
var path = require('path');
var DuplexEmitter = require('duplex-emitter');
var Mux = require('mux-demux');
var dnode = require('dnode');
var commands = require('./commands');

var serverOptions = {
  key:  fs.readFileSync(path.join(__dirname, 'certs', 'server', 'private-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'certificate.pem')),
  ca: [fs.readFileSync(path.join(__dirname, 'certs', 'root', 'certificate.pem'))],
  requestCert: true,
  rejectUnauthorized: true
};

var server = tls.createServer(serverOptions);

server.on('secureConnection', handleConnection);

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


/// client white list
var clientWhiteList = [
  'fridge-client-001'
];

function clientAllowed(name) {
  return clientWhiteList.indexOf(name) > -1;
}

// handle connections

function handleConnection(conn) {

  var mx = Mux(handleConnection);

  conn.on('error', onError);
  mx.on('error', onError);

  var clientName = conn.getPeerCertificate().subject.CN;
  if (! clientAllowed(clientName)) {
    return conn.emit('error', new Error('client not allowed: ' + clientName));
  }

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


  /// RPC

  function handleConnection(conn) {
    if (conn.meta != 'rpc') {
      onError(new Error('Invalid stream name: ' + conn.meta));
    }
    else {
      var d = dnode(commands);
      conn.pipe(d).pipe(conn);
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