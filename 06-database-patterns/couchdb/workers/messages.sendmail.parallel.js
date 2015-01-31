var follow = require('follow');
var couch = require('../couchdb');
var messages = couch.use('messages');
var SortedList = require('sortedlist');

var pendingSequences = SortedList.create();

var worker = 'messages.sendmail';

var maxParallel = 5;
var pending = 0;
var quit = false;

process.once('SIGINT', function() {
  console.log('shutting down...');
  if (! pending) {
    process.exit();
  }
  else {
    quit = true;
  }
});

var workerSequences = couch.use('workersequences');

workerSequences.get(worker, function(err, sequence) {

  var since = sequence && sequence.since || 0;

  console.log('since:', since);
  var feed = follow({
    db: couch.config.url + '/' + 'messages',
    include_docs: true,
    since: since
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
      pendingSequences.insert(change.seq);
      pending ++;
      maybePause();
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

    function savedMessage(err) {
      if (err) {
        console.error(err);
      }
      maybeSaveSequence();
    }

    function maybeSaveSequence() {
      var pos = pendingSequences.key(change.seq);
      pendingSequences.remove(pos);
      if (pos == 0) {
        saveSequence();
      }
      else {
        savedSequence();
      }
    }

    function saveSequence() {
      workerSequences.get(worker, function(err, sequence) {
        if (! sequence) {
          sequence = {
            _id: worker,
            since: 0
          };
        }
        if (sequence.since < change.seq) {
          sequence.since = change.seq;
          workerSequences.insert(sequence, savedSequence);
        }
        else {
          savedSequence();
        }
      });
    }

    function savedSequence(err) {
      if (err && err.statusCode == 409) {
        saveSequence();
      }
      else if (err) {
        throw(err);
      }
      else {
        pending --;
        console.log('PENDING: %d', pending);
        maybeQuit();
        maybeResume();
      }
    }
  }

  function sendEmail(message, cb) {
    // Fake send email
    setTimeout(cb, randomTime(1e3));
  }

  function maybePause() {
    if (quit || pending > maxParallel) {
      feed.pause();
    }
  }

  function maybeResume() {
    if (!quit && pending < maxParallel) {
      feed.resume();
    }
  }

  function maybeQuit() {
    if (quit && !pending) {
      process.exit();
    }
  }

  function randomTime(max) {
    return Math.floor(Math.random() * max);
  }
});