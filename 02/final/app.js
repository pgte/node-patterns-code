var currency = modules.require('currency');

[12, 12.34, 12.345].forEach(function(val) {
  var rounded = currency.round(val);
  console.log('rounded ' + val + ' is ' + rounded);
});