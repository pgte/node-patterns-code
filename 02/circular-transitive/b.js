modules.define('b', function(module) {
  var c = modules.require('c');
  c.push('b');
  module.exports = c;
});