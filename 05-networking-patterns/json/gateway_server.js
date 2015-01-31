var net = require('net');
var server = net.createServer();
var JSONDuplexStream = require('json-duplex-stream');

var Gateway = require('./gateway')

server.on('connection', handleConnection);
server.listen(8000, function() {
  console.log('server listening on %j', server.address());
});

function handleConnection(conn) {
  var s = JSONDuplexStream();
  var gateway = Gateway();
  conn.
    pipe(s.in).
    pipe(gateway).
    pipe(s.out).
    pipe(conn);

  s.in.on('error', onProtocolError);
  s.out.on('error', onProtocolError);
  conn.on('error', onConnError);

  function onProtocolError(err) {
    conn.end('protocol error:' + err.message);
  }
}

function onConnError(err) {
  console.error('connection error:', err.stack);
}