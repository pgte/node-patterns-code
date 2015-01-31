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
}());