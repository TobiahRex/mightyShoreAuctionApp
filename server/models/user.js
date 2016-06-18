'use strict';

let mongoose = require('mongoose');
// let Item     = require('./item');
let ObjectId = mongoose.Schema.Types.ObjectId;

let privs = {
  types   : 'administrator owner bidder'.split(' '),
  errmsg  : `enum validator failed for path {PATH} with value {VALUE}`
};

let userSchema = new mongoose.Schema({
  // access  :   {type : String, enum : adminTypes},
  name    :   {first : {type: String, required : true} , last : {type: String, required: true}},
  bio     :   {type : String},
  avatar  :   {type : String},
  // social  :   [{
  //   facebook  : String,
  //   twitter   : String,
  //   instagram : String
  // }]
  // items   :   [{type : ObjectId, ref : 'Item'}]
});

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



let User = mongoose.model('User', userSchema);

module.exports = User;
