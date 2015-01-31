var EventEmitter = require('events').EventEmitter;
var follow = require('follow');

var config = module.exports = new EventEmitter();

var source = process.env.CONFIG_SOURCE_URL || 'http://127.0.0.1:5984/config';
var seq = 0;

feed = new follow.Feed({
  db: source,
  since: seq,
  include_docs: true
});

feed.on('change', onConfigChange);

feed.follow();

config.stop = function() {
  feed.stop();
};

function onConfigChange(change) {
  var id = change.id;
  var doc;

  if (change.deleted) {
    delete config[id];
  }
  else {
    doc = change.doc;
    delete doc._id;
    delete doc._rev;

    config[id] = doc;
  }

  config.emit('change', id, doc);

  console.log('config["%s"] after change:', id, doc);
}