const async = require('async');
const fs = require('fs');

var work = [removeFile1, removeFile2];

function removeFile1(cb) {
  fs.unlink('./file1.txt', cb);
}

function removeFile2(cb) {
  fs.unlink('./file2.txt', cb);
}

async.series(work, done);

function done(err) {
  if (err) throw err;
  console.log('done');
}