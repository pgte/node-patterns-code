var Thermometer = require('./thermometer');

var thermometer = Thermometer({highWaterMark: 1});

setInterval(function() {
  var temp = thermometer.read();
  console.log('temp:', temp);
}, 1000);