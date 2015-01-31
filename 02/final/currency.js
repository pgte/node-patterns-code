modules.define('currency', function(module, exports) {
  var cache = modules.require('cache')(100);

  exports.round =  function(amount) {
    var rounded = cache.get(amount);
    if (! rounded) {
      rounded = Math.round(amount * 100) / 100;
      cache.set(amount, rounded);
    }
    return rounded;
  };

});