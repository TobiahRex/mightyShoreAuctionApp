'use strict';

const express = require('express');
const router  = express.Router();
const Item    = require('./item');
const User    = require('./user');

let Profile = {
  getNewItems(dbUser, cb){
    User.findById(req.params.id, (err, dbUser)=> {
      if(err) return cb(err);

      Item.find({}, (err, dbItems)=> {
        if(err) return cb(err);

        let recentItems = dbItems.map(dbItem => return dbUser.LastLogin < dbItem.Created ? dbItem : null);

        cb(null, recentItems);
      };
    });
  },
  saveResponse(reqBody, cb){ // post('/api/profiles/new_bids')
    let newBidObj = {
      UserId    : reqBody.User_id,
      Ammount  : reqBody.New_Bid,
      BidDate   : Date.now()
    };
    Item.findById(reqBody.Item_id, (err, dbItem) => {
      dbItem.Bids.push(newBidObj);
      dbItem.save(err =>{
        res.status(err ? 400 : 200).send(err || {SUCCESS : `New Bid Saved as ${newBidObj}`});
      });
    });
  },
  getNewBids(userId, cb){
      User.findById(req.params.id, (err, dbUser)=> {
        if(err) return cb(err);

        // Get Items belonging to User
        Item.find({Owner : dbUser._id}, (err, usersAuctions)=> {
          if(err) return cb(err);

          // Filter Items since last login for NEW bids
          let newBids = usersAuctions.map(auction => return auction.Bids.map(bid =>
            return bid.BidDate > dbUser.LastLogin ? bid : null;
          );
        );
        return cb(null, newBids);
      });
    });
  },
  saveResponse(reqObj, cb){
    // Saving new Replies or Comments (api post @ click)
    // req.body = {
    //   Like      : false / true,
    //   Reply     : false / true,
    //   ReplyLike : false / true,
    //   ItemId   :
    //   UserId   :
    //   CommentId :
    //   ReplyId   :
    //   ReplyBody :
    // };
    Item.findById(reqObj.Item_id, (err, dbItem)=> {
      if(err) return cb(err);
      // find Comment
      let Comment = dbItem.Comments.map(comment => {
        return comment.CommentId === reqObj.CommentId ? comment : null;
      });

      // Determine what types of response to insert
      let newCommentLike = newReply = newReplyLike = {};
      if(reqObj.Like) {
        newCommentLike.LikeId = uuid();
        newCommentLike.UserId = reqObj.User_id;
        Comment.Likes.push(newCommentLike);

      } else if(reqObj.Reply) {
        newReply.UserId     = reqObj.User_id;
        newReply.ReplyId    = uuid();
        newReply.Body       = reqObj.ReplyBody;
        newReply.ReplyDate  = Date.now();

        Comment.Replies.push(newReply);

      } else if(reqObj.ReplyLike){
        newReplyLike.Likeid = uuid();
        newReplyLike.Userid = reqObj.user_id;

        Comment.Replies.forEach(reply=>
          if(reply.ReplyId === reqObj.ReplyId) reply.Likes.push(newReplyLike);
        );
      };

      dbItem.save(err=> err ? cb(err) : cb(null, {SUCCESS : `New Response Saved.`}));
    });
  },
  getActiveBids(userId, cb){
    User.findById(userId, (err, dbUser)=> {
      if(err) cb(err);

      Item.find({Owner : dbUser._id}, (err, usersItems) => {
        if(err) cb(err);

        let activeItems = usersItems.map(item => {
          return item.Status === 'Active' ? item : null;
        });
        cb(null, activeItems);
      });
    });
  },
  getWatchList(userId, cb){
    User.findById(userId, (err, dbUser) =>{
      if(err) cb(err);

      
    })
  }
};


module.exports = Profile;
