var fs = require('fs');
var config = require('crdt').Doc();
var reconnect = require('reconnect-net');

module.exports = config;

var saving = false;
var saveAgain = false;

var argv = require('minimist')(process.argv.slice(2));

var savePath = argv['save-path'];

if (savePath) {
  var rs = fs.createReadStream(savePath)
  rs.pipe(config.createWriteStream());
  rs.once('error', write);
  rs.once('end', write);

  function write() {
    config.createReadStream().pipe(fs.createWriteStream(savePath));
  }
}

var configPort = argv['config-port'];

if (configPort) {
  var server = require('net').createServer(handleConfigConnection);
  server.listen(configPort);
}

var configHosts = argv['config-host'];
if (configHosts) {
  if (! Array.isArray(configHosts)) configHosts = [configHosts];
  configHosts.forEach(configClient);
}


/// Config network handling

function configClient(host) {
  var split = host.split(':');
  var hostname = split[0];
  var port = split[1];

  reconnect(handleConfigConnection).connect(port, hostname);
}

function handleConfigConnection(conn) {
  conn.pipe(config.createStream()).pipe(conn);
}

setInterval(function() {
  console.log('config: %j', config.toJSON());
}, 1000);