'use strict';

const mongoose = require('mongoose');
const User     = require('./user');
const Moment   = require('moment');
let ObjectId   = mongoose.Schema.Types.ObjectId;


let commentSchema = new mongoose.Schema({
  _Date     :     {
    type      :     Date,
    require   :     true
  },
  User_id   :     {
    type      :     ObjectId,
    ref       :     'User',
    required  :     true
  }
  Item_id   :     {
    type      :     ObjectId,
    ref       :     'Item',
    required  :     true
  },
  Body      :     {
    type      :     String,
    required  :     true
  }
});

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
