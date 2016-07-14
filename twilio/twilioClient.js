require('dotenv').config();
const config = require('./twilioConfig');
const client = require('twilio')(config.accountSid, config.authToken);

client.sendMessage({
  from: config.sendingNumber,
  to: '+14153210002',
  url: 'https://mighty-shore-12223.herokuapp.com/api/twiml/',
}, (err, res) => {
  console.log('err: ', err, '\nres: ', res);
});
