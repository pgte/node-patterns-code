var fs = require('fs');
var tls = require('tls');
var path = require('path');
var Mux = require('mux-demux');
var DuplexEmitter = require('duplex-emitter');


var options = {
  host: process.argv[2],
  port: Number(process.argv[3]),
  ca: [fs.readFileSync(path.join(__dirname, 'certs', 'root', 'certificate.pem'))],
  key: fs.readFileSync(path.join(__dirname, 'certs', 'client-001', 'private-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'client-001', 'certificate.pem')),
  rejectUnauthorized: true
};

var conn = tls.connect(options, onConnect);

conn.on('error', function(err) {
  console.log('error: %j', err);
});

var doorTimeoutSecs = Number(process.argv[4]);
var maxTemperature = Number(process.argv[5]);


var sensors = {
  'door': handleDoor,
  'temperature': handleTemperature
};

function onConnect() {
  console.log('connected', conn.authorized, conn.authorizationError);

  var mx = Mux(onStream);
  conn.pipe(mx).pipe(conn);

  function onStream(stream) {
    var handle = sensors[stream.meta];
    if (! handle) {
      throw new Error('Unknown stream: %j', stream.meta);
    }
    handle(DuplexEmitter(stream));
  }
}

/// Door

function handleDoor(door) {
  var timeout;
  var warned = false;

  door.on('open', onDoorOpen);
  door.on('close', onDoorClose);

  function onDoorOpen() {
    timeout = setTimeout(onDoorTimeout, doorTimeoutSecs * 1e3);
  }

  function onDoorClose() {
    if (warned) {
      warned = false;
      console.log('closed now');
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  }

  function onDoorTimeout() {
    warned = true;
    console.error(
      'DOOR OPEN FOR MORE THAN %d SECONDS, GO CLOSE IT!!!',
      doorTimeoutSecs);
  }
}


/// Temperature

function handleTemperature(temperature) {
  temperature.on('reading', onTemperatureReading);

  function onTemperatureReading(temp, units) {
    if (temp > maxTemperature) {
      console.error('FRIDGE IS TOO HOT: %d %s', temp, units);
    }
  }
}