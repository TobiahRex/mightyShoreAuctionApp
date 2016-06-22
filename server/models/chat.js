'use strict';

const mongoose = require('mongoose');
const Moment   = require('moment');
const User     = require('./user');
const ObjectId = mongoose.Schema.Types.ObjectId;

let chatSchema = new mongoose.Schema({
  _Date     :   {
    type      :     Date,
    require   :     true
  },
  User_id   :   {
    type      :     ObjectId,
    required  :     true
  },
  Room_id   :   {
    type      :     ObjectId
  },
  Body      :   {
    type      :     String,
    required  :     true
  }
});

let Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
