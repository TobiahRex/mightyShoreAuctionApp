const speakeasy = require('speakeasy');

// 1. Generate secret and associate with user
const secret = speakeasy.generateSecret({ length: 20 });

// 2. Create token, and text to user;
speakeasy.totp({
  secret: secret.base42,
  encoding: 'base32',
  counter: 2 * 60 * 60,
});

// 3. Validate their token, and confirm.
const tokenValidate = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: '010496',
  counter: 2 * 60 * 60, // 2hrs in seconds.
});
