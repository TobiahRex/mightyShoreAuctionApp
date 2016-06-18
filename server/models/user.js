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

  // REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER - userObj.body NEEDS ALL VALUES from the front end.

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
  let NewPassword;
  BCRYPT.hash(newUserObj._Password, 10, (err, hash)=> {
    if(err) cb(err);
    NewPassword = hash;
    newUserObj._Password = NewPassword;
    this.newUser(newUserObj, cb);
  });
};

userSchema.statics.authenticate = (userObj, cb) => {
  console.log('userObj: ',userObj);
  User.findOne({Username  :   userObj.Username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {ERROR : `Login Failed. Username or Password Inccorect. Try Again.`});

    BCRYPT.compare(userObj.Password, dbUser._Password, (err, result)=> {
      if(err || result !== true) return cb({ERROR : 'Login Failed. Username or Password Incorrect. Try Again.'});
    });

    let token = dbUser.createToken();
    dbUser._Password = null;
    cb(null, {token, dbUser});
  });
};

userSchema.methods.createToken = function(){
  let token = JWT.sign({_id : this._id}, JWT_SECRET);
  return token;
};



let User = mongoose.model('User', userSchema);

module.exports = User;
