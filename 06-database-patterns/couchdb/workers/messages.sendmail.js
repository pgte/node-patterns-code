var follow = require('follow');
var couch = require('../couchdb');
var messages = couch.use('messages');

var working = false;
var quit = false;

process.once('SIGINT', function() {
  console.log('shutting down...');
  if (! working) {
    process.exit();
  }
  else {
    quit = true;
  }
});

var workerSequences = couch.use('workersequences');

workerSequences.get('messages.sendmail', function(err, sequence) {
  if (! sequence) {
    sequence = {
      _id: 'messages.sendmail',
      since: 0
    };
  }
  console.log('last sequence:', sequence);

  var feed = follow({
    db: couch.config.url + '/' + 'messages',
    include_docs: true,
    since: sequence.since
  }, onChange);

  feed.filter = function filter(doc) {
    return doc._id.indexOf('_design/') != 0 && !doc.notifiedRecipient;
  };

  function onChange(err, change) {
    if (err) {
      console.error(err);
    }
    else {
      console.log(change);
      sequence.since = change.seq;
      working = true;
      feed.pause();
      var message = change.doc;
      sendEmail(message, sentEmail);
    }

    function sentEmail(err) {
      if (err) {
        console.error(err);
      }
      else {
        message.notifiedRecipient = true;
      }
      messages.insert(message, savedMessage);
    }
  }

  function sendEmail(message, cb) {
    // Fake send email
    setTimeout(cb, randomTime(1e3));
  }

  function savedMessage(err) {
    if (err) {
      console.error(err);
    }
    if (quit) {
      process.exit();
    }
    else {
      saveSequence();
    }
  }

  function saveSequence() {
    workerSequences.insert(sequence, savedSequence);
  }

  function savedSequence(err, result) {
    if (err) {
      throw(err);
    }

    sequence._rev = result.rev;
    working = false;
    feed.resume();
  }

  function randomTime(max) {
    return Math.floor(Math.random() * max);
  }
});