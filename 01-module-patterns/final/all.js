var modules =
(function() {

  var modules = {};

  function define(name, fn) {
    if (modules[name])
      throw Error('A module named ' + name + ' is already defined');

    var module = {
      exports: {},
      fn: fn,
      executed: false
    };

    modules[name] = module;
  }

  function require(name) {
    var module = modules[name];
    if (! module)
      throw new Error('Module ' + name + ' not found');

    if (! module.executed) {
      module.fn.call(module, module, module.exports);
      module.executed = true;
    }

    return module.exports;
  }

  return {
    define: define,
    require: require
  };
}());modules.define('cache', function(module) {
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
});modules.define('currency', function(module, exports) {
  var cache = modules.require('cache')(100);

  exports.round =  function(amount) {
    var rounded = cache.get(amount);
    if (! rounded) {
      rounded = Math.round(amount * 100) / 100;
      cache.set(amount, rounded);
    }
    return rounded;
  };

});var currency = modules.require('currency');

[12, 12.34, 12.345].forEach(function(val) {
  var rounded = currency.round(val);
  console.log('rounded ' + val + ' is ' + rounded);
});