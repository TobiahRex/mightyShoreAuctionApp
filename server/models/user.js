'use strict';

let mongoose = require('mongoose');
let Item     = require('./item');
let ObjectId = mongooose.Schema.Types.ObjectId;

let privs = {
  types   : 'administrator owner bidder'.split(' '),
  errmsg  : `enum validator failed for path ${PATH} with value ${VALUE}`
};

let userSchema = new mongoose.Schema({
  // access  :   {type : String, enum : adminTypes},
  name    :   {first : String, last : String},
  bio     :   {type : String},
  avatar  :   {type : String},
  social  :   [{
    facebook  : String,
    twitter   : String,
    instagram : String
  }],
  items   :   [{type : ObjectId, ref : 'Item'}];
});

userSchema.statics.create = (userObj, cb) => {
  if(!userObj) return cb({ERROR : `Did Not Provide User Information.`});
  
}

let User = mongoose.model('User', userSchema);

module.exports = User;
