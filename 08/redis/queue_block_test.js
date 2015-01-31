var queue = require('./queue_block');

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
  }
}

var worker = queue.Worker(popped);

function popped(err, work) {
  if (err) {
    throw err;
  }
  console.log('work:', work);
}