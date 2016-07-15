const express = require('express');
const router = new express.Router();
const twilio = require('twilio');


router.post('/', (req, res) => {
  const resp = new twilio.TwimlResponse();
  const options = { voice: 'woman', language: 'en-gb' };

  res.set('Content-Type', 'text/xml');
  resp.say('Yo yo Toby.', options);
  resp.say('Can you please teach me to douglas?', options);
  res.send(resp.toString());
});

module.exports = router;
