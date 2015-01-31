const async = require('async');
const fs = require('fs');

var work = [loadFile];

function loadFile(cb) {
  fs.readFile('./file1.txt', {encoding: 'utf8'}, function(err, fileContent) {
    if (err) return cb(err);

    if (fileContent.indexOf('node') == -1)
      work.push(removeFile);

    cb();
  });
}

function removeFile(cb) {
  fs.unlink('./file1.txt', cb);
}

async.series(work, done);

function done(err) {
  if (err) throw err;
  console.log('done');
}