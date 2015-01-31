var extend = require('util')._extend;
var diff = require('object-versions').diff;
var schemas = require('../schemas');
var errors = require('../errors');

var users = require('../couchdb').use('users');

/// Create user

exports.create = schemas.validating('user', 'create', createUser);

function createUser(user, cb) {
  users.insert(user, user.email, errors.wrapNano(cb));
}

/// Update user

exports.update = updateUser;

function updateUser(user, cb) {
  users.get(user._id, errors.wrapNano(function(err, currentUser) {
    if (err) {
      cb(err);
    }
    else {
      var userDiff = diff(currentUser, user);
      schemas.validate(userDiff, 'user', 'update', function(err) {
        if (err) {
          cb(err);
        }
        else {
          users.insert(user, errors.wrapNano(cb));
        }
      });
    }
  }));
}

exports.updateDiff = updateUserDiff;

function updateUserDiff(userDiff, cb) {
  schemas.validate(userDiff, 'user', 'update', function(err) {
    if (err) {
      cb(err);
    }
    else {
      merge();
    }
  });

  function merge() {
    users.get(userDiff._id, errors.wrapNano(function(err, user) {
      if (err) {
        cb(err);
      }
      else {
        extend(user, userDiff);
        users.insert(user, errors.wrapNano(done));
      }
    }));

    function done(err) {
      if (err && err.statusCode == 409 && !userDiff._rev) {
        merge(); // try again
      }
      else {
        cb.apply(null, arguments);
      }
    }
  }
}