
let config = {};

config.accountSid = process.env.TWILIO_ACCOUNT_SID;
config.authToken = process.env.TWILIO_AUTH_TOKEN;
config.sendingNumber = process.env.TWILIO_PHONE;

console.log(process.env.TWILIO_ACCOUNT_SID);

module.exports = config;
