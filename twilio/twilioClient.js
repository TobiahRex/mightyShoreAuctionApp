require('dotenv').config();
const config = require('./twilioConfig');
const client = require('twilio')(config.accountSid, config.authToken);

client.sendMessage({
  from: config.sendingNumber,
  to: '+14153210002',
  body: 'hi Toby.',
}, (err, res) => {
  console.log('err: ', err, '\nres: ', res);
});
