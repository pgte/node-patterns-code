var Thermometer = require('./thermometer');

var thermomether = Thermometer();

thermomether.on('data', function(temp) {
  console.log('temp:', temp);
});