var extend = require('util')._extend;
var schemas = require('../schemas');
var errors = require('../errors');

var messages = require('../couchdb').use('messages');

/// Create user

exports.create = schemas.validating('message', 'create', createMessage);

function createMessage(message, cb) {
  message.createdAt = Date.now();
  messages.insert(message, errors.wrapNano(cb));
}

/// Messages for a given user

exports.getFor = getMessagesFor;

function getMessagesFor(user, startKey, maxPerPage, cb) {
  messages.view(
    'by_to_createdAt', 'by_to_createdAt',
    {
      startkey: [user, startKey],
      endkey: [user, 0],
      descending: true,
      include_docs: true,
      limit: maxPerPage + 1
    },
    errors.wrapNano(function(err, result) {
      if (err) {
        cb(err);
      }
      else {
        result = result.rows.map(function(row) {
          return row.doc;
        });

        if (result.length > maxPerPage) {
          // remove the last record
          var next = result.pop().createdAt;
        }

        cb(null, result, next);
      }
    })
  );
}


/// Count messages for a given user

exports.countFor = countMessagesFor;

function countMessagesFor(user, cb) {
  messages.view('to_count', 'to_count', {
    keys: [user],
    group: true
  }, errors.wrapNano(function(err, result) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, result.rows[0].value);
    }
  }));
};