console.log(process.env.TWILIO_ACCOUNT_SID);
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
client.sendMessage({
  from: process.env.TWILIO_PHONE,
  to: '+14153210002',
  url: 'https://mighty-shore-12223.herokuapp.com/api/twiml/',
}, (err, res) => {
  console.log('err: ', err, '\nres: ', res);
});
