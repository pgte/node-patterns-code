var db = require('./sublevels');
var cuid = require('cuid');

exports.insert = insertMessage;

function insertMessage(to, from, subject, body, cb) {
  var id = cuid();
  var message = {
    to: to,
    from: from,
    subject: subject,
    body: body
  };

  var batch = [
    {
      type: 'put',
      key: id,
      value: message,
      prefix: db.messages.sublevel(from).sublevel('out')
    },
    {
      type: 'put',
      key: id,
      value: message,
      prefix: db.messages.sublevel(to).sublevel('in')
    }
  ];

  db.base.batch(batch, cb);
}
