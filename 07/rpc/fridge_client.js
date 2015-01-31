var Mux = require('mux-demux');
var Reconnect = require('reconnect-net');
var DuplexEmitter = require('duplex-emitter');

var hostname = process.argv[2];
var port = Number(process.argv[3]);
var doorTimeoutSecs = Number(process.argv[4]);
var maxTemperature = Number(process.argv[5]);

var reconnect = Reconnect(onConnect).connect(port, hostname);

var sensors = {
  'door': handleDoor,
  'temperature': handleTemperature
};

function onConnect(conn) {
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