const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneTokenSchema = new mongoose.Schema({
  UserId: { type: ObjectId, ref: 'User' },
  token: { type: String },
  expiration: { type: Date, required: true },
});
const PhoneToken = mongoose.model('PhoneToken', phoneTokenSchema);

phoneTokenSchema.statics.generate = (UserId, cb) => {
  if (!UserId) return cb({ Error: 'Did not provide User to generate PhoneToken.' });
  return PhoneToken.remove({ UserId }, err => {
    if (err) return cb(err);
    const token = Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
    const newPhoneToken = new PhoneToken({
      UserId,
      token,
      expiration: moment().add(30, 'mins').toDate(),
    });
    return newPhoneToken.save((err, savedPhoneToken)=>{
      if (err) return cb(err);
      PhoneToken.sendToken(savedPhoneToken);
    });
  });
};

phoneTokenSchema.statics.verify = (UserId, tokenCode, cb) => {
  PhoneToken.find({ UserId }, (err, dbPhoneToken) => {
    if (err) return cb(err);
    if (moment().isAfter(dbPhoneToken.expiration)) return cb(null, false);
    if (dbPhoneToken.token === tokenCode) {
      return cb(null, true);
    }
    return cb(null, false);
  });
};

phoneTokenSchema.methods.sendToken = function (PhoneTokenObj) {
  User.find(PhoneTokenObj, (err, dbUser) => {
    if (err) return (err);
    return twilio.sendMessage({
      from: process.env.TWILIO_PHONE,
      to: dbUser.PhoneNumber,
      body: `Hey there! \nEnter ${token} on your profile page to verify your Account.`,
    }, (err, res) => {
      console.error('err: ', err, '\nres: ', res);
    });
  });
};


module.exports = PhoneToken;
