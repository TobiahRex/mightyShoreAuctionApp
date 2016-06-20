'use strict';

require('dotenv').load();
const mongoose    = require('mongoose');
const Item        = require('./item');
const JWT         = require('jsonwebtoken');
const BCRYPT      = require('bcryptjs');
const JWT_SECRET  = process.env.JWT_SECRET;
const ObjectId    = mongoose.Schema.Types.ObjectId;


let userSchema = new mongoose.Schema({
  Access  :   {type     : String, enum : ['Administrator', 'Moderator', 'Customer'], required   :   true },
  Name    :   {first    : {type : String, required : true} , last : {type   : String, required  : true}},
  Bio     :   {type     : String},
  Avatar  :   {type     : String},
  Likes   :   [{type     :   ObjectId, ref   :   'Item'}],
  Bids    :   [{type     :   ObjectId, ref   :   'Item'}],
  Items   :   [{type : ObjectId, ref : 'Item'}],
  // Social Data
  Username  :   {type   :   String, required  :   true},
  _Password  :   {type   :   String, required   :   true},
  Social    :   {facebook : String, twitter : String, instagram : String },

  // Chat Data

});

// CRUD Below

userSchema.statics.newUser = (userObj, cb) => {
  if(!userObj) return cb({ERROR : `Did Not Provide User Information.`});
  User.create(userObj, err => {
    err ? cb(err) :
    User.find({}, (err, dbUsers)=> {
      err ? cb(err) : cb(null, dbUsers);
    });
  });
};

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

// Auth MiddleWare

userSchema.statics.register = function(newUserObj, cb){
  BCRYPT.hash(newUserObj._Password, 10, (err, hash)=> {
    if(err) cb(err);
    newUserObj._Password = hash;
    this.newUser(newUserObj, cb);
  });
};

userSchema.statics.authenticate = (userObj, cb) => {
  User.findOne({Username  :   userObj.Username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {ERROR : `Login Failed. Username or Password Inccorect. Try Again.`});
    BCRYPT.compare(userObj._Password, dbUser._Password, (err, result)=> {
      if(err || result !== true) return cb({ERROR : 'Login Failed. Username or Password Incorrect. Try Again.'});
    });

    let token = dbUser.createToken();
    // dbUser._Password = null;
    cb(null, {token, dbUser});
  });
};

// Auth MiddleWare - Route Access Verification
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

let User = mongoose.model('User', userSchema);
module.exports = User;
