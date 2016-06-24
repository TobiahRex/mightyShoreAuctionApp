'use strict';

require('dotenv').load();
const mongoose    = require('mongoose');
const moment      = require('moment');
const JWT         = require('jsonwebtoken');
const BCRYPT      = require('bcryptjs');
const JWT_SECRET  = process.env.JWT_SECRET;
const ObjectId    = mongoose.Schema.Types.ObjectId;

const Mail        = require('./mail');
const Item        = require('./item');
const Comment     = require('./comment');
const Chat        = require('./chat');

let userSchema = new mongoose.Schema({
  Access    :   {
    type        :   String,
    enum        :   ['Administrator', 'Moderator', 'Customer', 'Not-Assigned'],
    required    :   true
  },
  Username  :   {
    type        :   String,
    required    :   true
  },
  _Password :   {
    type        :   String,
    required    :   true
  },
  Firstname     :   {
    type      :   String,
    required  :   true
  },
  Lastname      :   {
    type      :   String,
    required  :   true
  },
  Email         :   {
    type      :     'String',
    required  :     true,
    unique    :     true
  },
  Verified  :   {
    type      :     Boolean,
    default   :     false
  },
  Bio       :   {
    type        :     String
  },
  Avatar    :   {
    type        :     String
  },
  Watchlist :   [{
    type      :     ObjectId,
    ref       :     'Item'
  }],
  ChatMsgs  :   [{  // chat messages user has written
    type        :     ObjectId,
    ref         :     'Chat'
  }],
  Comments  :   [{  // comments user has posted @ auctions
    type        :   ObjectId,
    ref         :   'Comments'
  }],
  Items     :   [{  // items user has posted for auction
    type        :   ObjectId,
    ref         :   'Item'
  }],
  Bids      :   [{  // bids user has made
    type        :   ObjectId,
    ref         :   'Item'
  }],
  Likes     :   [{  // auctions user has liked
    type        :   ObjectId,
    ref         :   'Item'
  }],
  Social    :   {   // OAuth user ID's
  facebook    :   {
    type        :     String
  },
  twitter     :   {
    type        :     String
  },
  instagram   :   {
    type        :     String
  }
},
  LastLogin   :   {
  type        :     Date
}
});

// CRUD
userSchema.statics.getUser = (userId, cb) => {
  if(!userId) return cb({ERROR : `Did Not Provide ID; ${userId}`});
  User.findById(userId, (err, dbUser) => {
    err ? cb(err) : cb(null, dbUser);
  });
};

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
  BCRYPT.hash(newUserObj._Password, 12, (err, hash)=> {
    if(err) cb(err);

    let user = new User({
      Access    :   newUserObj.Access,
      Username  :   newUserObj.Username,
      Firstname :   newUserObj.Firstname,
      Lastname  :   newUserObj.Lastname,
      Email     :   newUserObj.Email,
      _Password :   hash,
      Bio       :   newUserObj.Bio,
      Avatar    :   newUserObj.Avatar
    });
    user.save((err, savedUser)=> {
      if(err) return cb(err);

      Mail.verify(savedUser, response =>{

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
    _id :   this._id,
    exp :   moment().add(1, 'w').unix()
  };

  let token = JWT.sign(payload, JWT_SECRET);
  return `http://localhost:3000/api/users/verify/${token}`;
};

userSchema.statics.emailVerify = (token, cb) => {
  if(!token) return cb({ERROR : 'Token not recieved.'});

  JWT.verify(token, JWT_SECRET, (err, payload)=> {
    if(err) return res.status(400).send(err);
    // if(payload.exp < Date.now()) return cb({ERROR : `Verification link expired on ${Date(payload.exp)}`});

    User.findById(payload._id, (err, dbUser)=> {
      if(err || !dbUser) return cb(err || 'User not found');
      dbUser.Verified = true;
      dbUser.save(cb);
    });
  });
};
// Auth MiddleWare
userSchema.statics.authenticate = (userObj, cb) => {
  User.findOne({Username  :   userObj.Username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {ERROR : `Login Failed. Username or Password Inccorect. Try Again.`});
    BCRYPT.compare(userObj._Password, dbUser._Password, (err, result)=> {
      if(err || result !== true) return cb({ERROR : 'Login Failed. Username or Password Incorrect. Try Again.'});
    });
    let token = dbUser.createToken();
    dbUser.LastLogin = Date.now();
    dbUser.save((err, savedUser)=> {
      if(err) return cb(err);
      savedUser._Password = null;
      cb(null, {token, savedUser});
    });
  });
};

userSchema.statics.loginVerify = function(req, res, next){
  let token = req.cookies.accessToken;
  JWT.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(400).send({ERROR : `HACKER! You are not Authorized!`});
    User.findById(payload._id)
    .select({_Password : false})
    .exec((err, dbUser)=> {
      if(err || !dbUser){
        return
        res.clearCookie('accessToken')
        .status(400)
        .send(err || {error : `User Not Found.`});
      }; // else
      req.user = dbUser;
      next();
    });
  });
};

userSchema.methods.createToken = function(){
  let thisId = this._id;
  let token = JWT.sign({_id : this._id}, JWT_SECRET);
  return token;
};

var User = mongoose.model('User', userSchema);
module.exports = User;
