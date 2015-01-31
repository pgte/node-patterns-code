modules.define('cache', function(module) {
  module.exports = function(max) {
    var keys = [];
    var cache = {};

    return {
      get: function(key) {
        return cache[key];
      },
      set: function(key, value) {
        keys.push(key);
        if (keys.length > max) {
          var oldestKey = keys.shift();
          delete cache[oldestKey];
        }
        cache[key] = value;
      }
    };
  }
});