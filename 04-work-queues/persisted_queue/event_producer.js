var relay = require('./event_relay');

for(var i = 0 ; i < 10; i ++) {
  relay.push({id: i, event: 'door opened', when: Date.now()});
}