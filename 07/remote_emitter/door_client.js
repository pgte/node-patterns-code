var net = require('net');
var DuplexEmitter = require('duplex-emitter');

var hostname = process.argv[2];
var port = Number(process.argv[3]);
var timeoutSecs = Number(process.argv[4]);

var timeout;
var warned = false;

var conn = net.connect(port, hostname);
var remoteEmitter = DuplexEmitter(conn);

remoteEmitter.on('open', onOpen);
remoteEmitter.on('close', onClose);

function onOpen(time) {
  timeout = setTimeout(onTimeout, timeoutSecs * 1e3);
}

function onClose() {
  if (warned) {
    warned = false;
    console.log('closed now');
  }
  if (timeout) {
    clearTimeout(timeout);
  }
}

function onTimeout() {
  warned = true;
  console.error(
    'DOOR OPEN FOR MORE THAN %d SECONDS, GO CLOSE IT!!!',
    timeoutSecs);
}