const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const moment = require('moment');
const JWT = require('jsonwebtoken');
const BCRYPT = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mail = require('./mail');

const userSchema = new mongoose.Schema({
  Admin: { type: Boolean, default: false },
  PhoneNumber: { type: String },
  Username: { type: String, required: true },
  _Password: { type: String },
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Verified: { type: Boolean, default: false },
  Bio: { type: String },
  Avatar: { type: String },
  CoverPhoto: { type: String },
  Social: {
    facebookId: { type: String },
    facebookLink: { type: String },
    twitterId: { type: String },
    instagramId: { type: String },
    gitHubId: { type: String },
  },
  LastLogin: { type: Date },
  rComments: [{ type: ObjectId, ref: 'Comment' }],
  wComments: [{ type: ObjectId, ref: 'Comment' }],
  rMessages: [{ type: ObjectId, ref: 'Message' }],
  wMessages: [{ type: ObjectId, ref: 'Message' }],
  Watchlist: [{ type: ObjectId, ref: 'Item' }],
  Items: [{ type: ObjectId, ref: 'Item' }],
  Wins: [{ type: ObjectId, ref: 'Item' }],
  Losses: [{ type: ObjectId, ref: 'Item' }],
  Bids: [{ type: ObjectId, ref: 'Item' }],
  Likes: [{ type: ObjectId, ref: 'Item' }],
  AccountId: { type: ObjectId, ref: 'Account' },
  ChatId: { type: ObjectId, ref: 'Chat' },
});

// CRUD
userSchema.statics.getUser = (userId, cb) => {
  if (!userId) return cb({ ERROR: `Did Not Provide ID; ${userId}` });
  return User.findById(userId, (err, dbUser) => {
    if (err) return cb(err);
    return cb(null, dbUser);
  });
};

userSchema.statics.getAllPopulate = cb => User.find({}).deepPopulate('rComments, wComments, rMessages, wMessages').exec((err, dbUsers)=> err ? cb(err) : cb(null, dbUsers));

userSchema.statics.updateUser = (userObj, cb) => {
  if(!userObj.id) return cb({ERROR : `User ID ${userObj.id} not Found. Verify ID.`});
  User.findByIdAndUpdate(userObj.id, {$set : userObj.body }, (err, outdatedDbUser) => {
    err ? cb(err) : User.findById(outdatedDbUser._id, (err, updatedDbUser) => {
      err ? cb(err) : cb(null, updatedDbUser);
    });
  });
};

userSchema.statics.removeUser = (userId, cb) => {
  if(!userId) return cb({ERROR : `Cannot Remove:  ${userObj.id} not Found. Verify ID`});
  User.findByIdAndRemove(userId, (err, oldDbUser)=>{
    err ? cb(err) : cb(null, {SUCCESS : `REMOVED - \n${oldDbUser}`});
  });
};

// New User Methods
userSchema.statics.register = function(newUserObj, cb){
  User.findOne({Email : newUserObj.Email}, (err, dbUser)=>{
    if(err || dbUser) return cb(err || {ERROR : `That Email has already been taken.`});
  });

  BCRYPT.hash(newUserObj._Password, 12, (err, hash) => {
    if (err) cb(err);

    const user = new User({
      Access: newUserObj.Access,
      Username: newUserObj.Username,
      Firstname: newUserObj.Firstname,
      Lastname: newUserObj.Lastname,
      Email: newUserObj.Email,
      _Password: hash,
      Bio: newUserObj.Bio,
      Avatar: newUserObj.Avatar
    });
    user.save((err, savedUser)=> {
      if(err) return cb(err);

      Mail.verify(savedUser, response => {
        if(response.statusCode !== 202) return cb(err);
        savedUser._Password = null;
        cb(err, savedUser);
      });
    });
  });
};

userSchema.methods.profileLink = function(){
  let exp = moment().add(1, 'w');
  let payload = {
    _id: this._id,
    exp: moment().add(1, 'w').unix()
  };
  let token = JWT.sign(payload, JWT_SECRET);
  return `http://localhost:${PORT}/api/users/verify/${token}`;
};

userSchema.statics.emailVerify = (token, cb) => {
  if (!token) return cb({ ERROR: 'Token not recieved.' });

  return JWT.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return cb(err);
    return User.findById(payload._id, (err, dbUser) => {
      if (err || !dbUser) return cb(err || 'User not found');
      dbUser.Verified = true;
      dbUser.save(cb);
    });
  });
};

// Auth MiddleWare
userSchema.statics.authenticate = (UserObj, cb) => {
  User.findOne({ Username: UserObj.Username}, (err1, dbUser) => {
    if (err1 || !dbUser) {
      return cb(err1 || { ERROR: 'Login Failed. Username or Password Inccorect. Try Again.' })
    }
    BCRYPT.compare(UserObj._Password, dbUser._Password, (err2, result) => {
      if (err2 || result !== true){
        return cb({ ERROR: 'Login Failed. Username or Password Incorrect. Try Again.' })
       }
    });
    const token = dbUser.createToken();
    dbUser.LastLogin = Date.now();
    dbUser.save((err3, savedUser) => {
      if (err3) return cb(err3);
      savedUser._Password = null;
      console.log('token: ', token);
      return cb(null, { token, savedUser });
    });
  });
};

userSchema.statics.authorize = function (clearance = { Admin: false }) {
  return function (req, res, next) {
    console.log('req.headers: ', req.headers);
    const tokenHeader = req.headers.authorization;
    console.log('tokenHeader: ', tokenHeader);
    if (!tokenHeader) return res.status(400).send({ ERROR: 'User not found' });
    const token = tokenHeader.split(' ')[1];

    JWT.verify(token, JWT_SECRET, (err1, payload) => {
      if (err1) return res.status(400).send({ ERROR: 'HACKER! You are not Authorized!' });
      return User.findById(payload._id)
      .select({ _Password: false })
      .exec((err2, dbUser) => {
        if (err2 || !dbUser) {
          return res.clearCookie('accessToken')
          .status(400)
          .send(err2 || { error: 'User Not Found.' });
        }
        req.user = dbUser;
        return next();
      });
    });
  };
};

userSchema.methods.createToken = function () {
  return JWT.sign({ _id: this._id }, JWT_SECRET);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
