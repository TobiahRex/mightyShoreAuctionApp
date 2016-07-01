'use strict';

const express = require('express');
const router  = express.Router();
const Item    = require('./item');
const User    = require('./user');

let Profile = {

      getNewBids(userId, cb){ // new bids on users' posted Auctions since last login
      User.findById(req.params.id, (err, dbUser)=> {
        if(err) return cb(err);

        // Get Items belonging to User
        Item.find({Owner : dbUser._id})
        .populate('User')
        .exec((err, usersAuctions)=> {
          if(err) return cb(err);

          // Filter Items since last login for NEW bids
          let newBids = usersAuctions.map(auction => {
            return auction.Bids.map(bid =>
              return bid.BidDate > dbUser.LastLogin ? bid : null;
          }
          );
        );
        return cb(null, newBids);
      });
    });
  },
  saveResponse(reqObj, cb){ // users responses on own Auction posts
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
      Item.find({'_id' : {$in : dbUser.Watchlist}}, (err, dbItems)=> {
        let qErr = new Error(`Batch find for Watchlist UNSAT : ${err}`);
        err ? cb(qErr) : cb(null, dbItems);
      });
    });
  },
  updateBid(reqObj, cb){
    // reqObj = {
    //   UserId  :
    //   ItemId  :
    //   Ammount :
    // }
    let thisUser,
    thisItem;
    User.find(reqObj.UserId, (err, dbUser)=> err ? cb(err) : thisUser = dbUser);
    Item.find(reqObj.ItemId, (err, dbItem)=> err ? return cb(err) : thisItem = dbItem);

    let newBid = { UserId  : reqObj.UserId, Ammount : reqObj.Ammount };
    thisUser.Bids.push(reqObj.ItemId);
    thisItem.Bids.push(newBid);
    thisItem.HighestBid = newBid;

    thisItem.save((err, savedItem) => {
      err ? cb(err) : thisUser.save((err, savedUser) => {
        err ? cb(err) : cb(null, {savedItem, savedUser});
      });
    });
  },
  removeWatch(reqObj, cb){
    User.find(reqObj.UserId, (err, dbUser)=> {
      err ? cb(err) :
      dbUser.Watchlist.filter(item => item !== reqObj.ItemId);
      dbUser.save((err, savedUser) => err ? cb(err) : cb(null, savedUser));
    });
  },
  getStats(userId, cb){
    User.find(userId, (err, dbUser)=> {
      if(err) cb(err);

      let qErr = new Err(`Batch find for retrieving Stats UNSAT`);
      Item.find({'_id'  : {$in : dbUser.Wins}}, (err, dbWinItems)=> {
        err ? cb(qErr) : Item.find({'_id' : {$in : dbUser.Losses}}, (err, dbLossItems)=> {
          err ? cb(qErr) : cb(null, {dbWinItems, dbLossItems});
        })
      });
    });
  }
};

module.exports = Profile;
