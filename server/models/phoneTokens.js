const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment');
const User = require('./user');

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
      token,
      expiration: moment().add(30, 'mins').toDate(),
    });
    return newPhoneToken.save(cb);
  });
};

phoneTokenSchema.statics.verify = (UserId, tokenCode, cb) => {
  User.find({ UserId }, (err1, dbUser) => {
    PhoneToken.find({ token: tokenCode }, (err2, dbPhoneToken) => {
      if (err1 || err2) return cb(err1 || err2);
      if (dbPhoneToken.UserId !== dbUser._id) {
        return cb(null, false);
      } else if (dbPhoneToken.token === tokenCode) {
        return cb(null, true);
      }
      return cb(null, false);
    });
  });
};

module.exports = PhoneToken;
