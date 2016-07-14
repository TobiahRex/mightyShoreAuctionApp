const dotenv = require('dotenv').load();
const config = {};

config.accountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
config.authToken  = process.env.TWILIO_TEST_AUTH_TOKEN;
config.sendingNumber = process.env.TWILIO_PHONE;
