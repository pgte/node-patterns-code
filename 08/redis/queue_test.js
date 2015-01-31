var queue = require('./queue');

var missing = 10;

for(var i = 0 ; i < 10 ; i ++) {
  queue.push({some: 'work', id: i}, pushed);
}

function pushed(err) {
  if (err) {
    throw err;
  }
  if (-- missing == 0) {
    console.log('all work is pushed');
    poll();
  }
}

function poll() {
  queue.pop(popped);
}

function popped(err, work) {
  if (err) {
    throw err;
  }
  console.log('work:', work);
  if (! work) {
    setTimeout(poll, 1e3);
  }
  else {
    poll();
  }
}