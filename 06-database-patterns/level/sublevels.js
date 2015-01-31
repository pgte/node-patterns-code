var level = require('level');
var path = require('path');
var sublevel = require('level-sublevel');

var dbPath = process.env.DB_PATH || path.join(__dirname, 'sublevels');
var db = sublevel(level(dbPath, {
  valueEncoding: 'json'
}));

exports.base = db;
exports.users = db.sublevel('users');
exports.messages = db.sublevel('messages');

require('./sublevels_user_hook');