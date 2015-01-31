var async = require('async');
var equal = require('deep-equal');
var couch = require('../couchdb');

var databaseNames = ['messages'];

var views = {};

databaseNames.forEach(function(database) {
  views[database] = require('./' + database);
});

exports.populate = function populate(cb) {
  async.each(databaseNames, populateDB, cb);
};

function populateDB(dbName, cb) {
  var db = couch.use(dbName);
  var dbViews = views[dbName];

  async.eachSeries(Object.keys(dbViews), ensureView, cb);

  function ensureView(viewName, cb) {
    var view = dbViews[viewName];

    var ddocName = '_design/' + viewName;
    db.get(ddocName, function(err, ddoc) {
      if (err && err.statusCode == 404) {
        insertDDoc(null, cb);
      }
      else if (err) {
        cb(err);
      }
      else if (equal(ddoc.views[viewName], view)) {
        cb();
      }
      else {
        insertDDoc(ddoc, cb);
      }
    });

    function insertDDoc(ddoc, cb) {
      if (! ddoc) {
        ddoc = {
          language: 'javascript',
          views: {}
        };
      }

      ddoc.views[viewName] = view;

      db.insert(ddoc, ddocName, function(err) {
        if (err && err.statusCode == 409) {
          ensureView(viewName, cb);
        }
        else {
          cb(err);
        }
      });
    }
  }
}
