'use strict';

import ('dotenv').load();

import mongoose from ('mongoose');
import Item     from ('./item');
import JWT      from ('jsonwebtoken');
import BCRYPT   from ('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const ObjectId   = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  Name : {first : {type : String}, last : {type : String}}
});

userSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next();
  bcrypt.hash(user.password, 12, (err, hash)=> {
    user.password = hash;
    next();
  })
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch)=> {
    cb(err, isMatch);
  })
}
