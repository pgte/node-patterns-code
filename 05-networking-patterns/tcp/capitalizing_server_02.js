var net = require('net');
var CapitalizingStream = require('./capitalizing_stream');

var server = net.createServer();
server.on('connection', handleConnection);

server.listen(9000, function() {
  console.log('server listening to %j', server.address());
});

function handleConnection(conn) {
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  var service = new CapitalizingStream();

  service.once('error', onServiceError);

  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  conn.pipe(service).pipe(conn);

  function onServiceError(err) {
    conn.end('Error: ' + err.message + '\n');
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}