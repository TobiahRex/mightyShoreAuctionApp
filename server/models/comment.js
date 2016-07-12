'use strict';

const mongoose      = require('mongoose');
const User          = require('./user');
const Moment        = require('moment');
const deepPopulate  = require('mongoose-deep-populate')(mongoose);
let ObjectId        = mongoose.Schema.Types.ObjectId;


let commentLikeSchema = new mongoose.Schema({
  UserId  :   {
    type    :   ObjectId,
    ref     :   'User'
  },
  likeDate:   {
    type    :   Date,
    default :   Date.now
  }
});

let commentSchema = new mongoose.Schema({
  User_id   :     {
    type      :     ObjectId,
    ref       :     'User',
    required  :     true
  },
  CommentDate     :     {
    type      :     Date,
    default   :     Date.now
  },
  Item_id   :     {
    type      :     ObjectId,
    ref       :     'Item',
    required  :     true
  },
  Body      :     {
    type      :     String,
    required  :     true
  },
  Likes     :     [commentLikeSchema],
  Replies   :     [{type : ObjectId, ref : 'Reply'}]
});
commentSchema.plugin(deepPopulate);

commentSchema.statics.addComment = (reqBody, cb) =>{
  if(!reqBody.user || !reqBody.person) return cb({ERROR : 'Did not provide necessary Id\'s.'});

  User.findById(reqBody.user, (err1, dbUser)=>{
    User.findById(reqBody.person, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newComment = new Comment({
        UserId      : dbPerson._id,
        CommentDate : Date.now(),
        Body        : reqBody.comment
      });

      newComment.save((err, dbComment)=>{
        if(err) return cb(err);

        dbUser.rComments.push(dbComment._id);
        dbPerson.wComments.push(dbComment._id);
        dbUser.save((err1, savedUser)=> {
          dbPerson.save((err2, savedPerson)=>{
            err1 || err2 ? cb(err1 || err2) : cb(null, {savedUser, savedPerson});
          });
        });
      });
    });
  });
};

commentSchema.statics.addLike = (reqBody, cb) =>{
  if(!reqBody.comId) return cb({ERROR : 'Did not provide comment Id for like.'});

  Comment.findById(reqBody.commId, (err1, dbComment)=>{
    User.findById(reqBody.personId, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newLike = {UserId : dbPerson._id};

      dbComment.Likes.push(newLike);
      dbComment.save((err, savedComment)=>{
        err ? cb(err) : cb(null, savedComment);
      });
    });
  });
};

commentSchema.statics.populateAll = cb => Comment.find({}).deepPopulate('Replies, Replies.UserId').exec((err, dbComments)=> err ? cb(err) : cb(null, dbComments));

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
