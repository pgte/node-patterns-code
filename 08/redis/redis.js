var redis = require('redis');

var conn = module.exports = redis.createClient();
conn.unref();
