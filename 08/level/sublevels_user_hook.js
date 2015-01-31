var cuid = require('cuid');
var db = require('./sublevels');
var userChanges = db.base.sublevel('userchanges');

db.users.pre(function(change, add) {
  add({
    type: 'put',
    key: cuid(),
    value: {
      when: new Date(),
      change: change
    },
    prefix: userChanges.sublevel(change.key)
  });
});