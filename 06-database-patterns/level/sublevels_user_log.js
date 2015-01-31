var db = require('./sublevels').base.sublevel('userchanges');

var email = process.argv[2];

var userChanges = db.sublevel(email);

userChanges.createValueStream().on('data', function(message) {
  console.log('User Change: %j', message);
})
.once('end', function() {
  console.log('no more changes');
});
