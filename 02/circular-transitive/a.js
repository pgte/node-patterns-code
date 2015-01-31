modules.define('a', function(module, exports) {
  exports.array = ['a'];
  modules.require('b');
});