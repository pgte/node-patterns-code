var queue = require('./queue_block_safe');

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

var worker = queue.Worker(work);

function work(item, id, cb) {
  console.log('work item:', item);
  setTimeout(cb, Math.floor(Math.random * 1e3));
}