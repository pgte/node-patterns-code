var http = require('http');
http.globalAgent.maxSockets = Number(process.env.HTTP_MAX_SOCKETS) || 1024;

var nano = require('nano');

module.exports = nano(process.env.COUCHDB_URL || 'http://127.0.0.1:5984');