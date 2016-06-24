'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = require('./user');
const Item = require('./item');

let accountSchema = new mongoose.Schema({
  UserId    :     {
    type      :     ObjectId,
    ref       :     'User'
  }
});

let Account = mongoose.model('Account', accountSchema);
module.exports = Account;
