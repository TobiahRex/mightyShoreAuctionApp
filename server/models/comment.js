const mongoose = require('mongoose');
const User = require('./user');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const ObjectId = mongoose.Schema.Types.ObjectId;


const commentLikeSchema = new mongoose.Schema({
  UserId: { type: ObjectId, ref: 'User' },
  likeDate: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  User_id: { type: ObjectId, ref: 'User', required: true },
  CommentDate: { type: Date, default: Date.now },
  Item_id: { type: ObjectId, ref: 'Item', required: true },
  Body: { type: String, required: true },
  Likes: [commentLikeSchema],
  Replies: [{ type: ObjectId, ref: 'Reply' }],
});
commentSchema.plugin(deepPopulate);

commentSchema.statics.addComment = (reqBody, cb) => {
  if (!reqBody.user || !reqBody.person) return cb({ ERROR: 'Did not provide necessary Id\'s.' });

  return User.findById(reqBody.user, (err1, dbUser) => {
    User.findById(reqBody.person, (err2, dbPerson) => {
      if (err1 || err2) return cb(err1 || err2);

      const newComment = new Comment({
        UserId: dbPerson._id,
        CommentDate: Date.now(),
        Body: reqBody.comment
      });

      newComment.save((err, dbComment) => {
        if (err) return cb(err);

        dbUser.rComments.push(dbComment._id);
        dbPerson.wComments.push(dbComment._id);
        return dbUser.save((err3, savedUser) => {
          dbPerson.save((err4, savedPerson) => {
            if (err3 || err4) return cb(err3 || err4);
            return cb(null, { savedUser, savedPerson });
          });
        });
      });
    });
  });
};

commentSchema.statics.addLike = (reqBody, cb) =>{
  if (!reqBody.comId) return cb({ ERROR: 'Did not provide comment Id for like.' });
  Comment.findById(reqBody.commId, (err1, dbComment) => {
    User.findById(reqBody.personId, (err2, dbPerson) => {
      if (err1 || err2) return cb(err1 || err2);
      const newLike = { UserId: dbPerson._id };
      dbComment.Likes.push(newLike);
      return dbComment.save((err, savedComment) => {
        if (err) return cb(err);
        return cb(null, savedComment);
      });
    });
  });
};

commentSchema.statics.populateAll = cb =>
Comment.find({})
.deepPopulate('Replies, Replies.UserId')
.exec((err, dbComments) => {
  if (err) return cb(err);
  return cb(null, dbComments);
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
