modules.define('c', function(module) {
  var a = modules.require('a');
  a.array.push('c');
  module.exports = a.array;
});