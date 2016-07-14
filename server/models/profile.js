const Item = require('./item');
const User = require('./user');
const uuid = require('uuid');

const Profile = {
  getNewBids(userId, cb) { // new bids on users' posted Auctions since last login
    User.findById(userId, (err1, dbUser) => {
      if (err1) return cb(err1);
      // Get Items belonging to User
      return Item.find({ Owner: dbUser._id })
      .populate('User')
      .exec((err2, usersAuctions) => {
        if (err2) return cb(err2);
        // Filter Items since last login for NEW bids
        const newBids = usersAuctions.map(auction =>
          auction.Bids.map(bid => {
            if (bid.BidDate > dbUser.LastLogin) return bid;
            return null;
          })
        );
        return cb(null, newBids);
      });
    });
  },
  saveResponse(reqObj, userId, cb) {
  // Users' response to posts on own Auction posts
  //
  // Saving new Replies or Comments
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
    Item.findById(reqObj.Item_id, (err1, dbItem) => {
      User.findById(userId, (err2, dbUser) => {
        if (err1 || err2) return cb(err1 || err2);
        // 1) find Comment
        const Comment = dbItem.Comments.map(comment => {
          if (comment.CommentId === reqObj.CommentId) return comment;
          return null;
        });
        if (Comment === null) return cb({ ERROR: 'Required DB Comment not found.' });
        // Determine what types of responses to insert
        const newCommentLike = {};
        const newReply = {};
        const newReplyLike = {};
        if (reqObj.Like) {
          newCommentLike.LikeId = uuid();
          newCommentLike.UserId = dbUser._id;
          Comment.Likes.push(newCommentLike);
        } else if (reqObj.Reply) {
          newReply.UserId = dbUser._id;
          newReply.ReplyId = uuid();
          newReply.Body = reqObj.ReplyBody;
          newReply.ReplyDate = Date.now();
          Comment.Replies.push(newReply);
        } else if (reqObj.ReplyLike) {
          newReplyLike.Likeid = uuid(); // TODO Replace this UUID instance with it's own Schema.
          newReplyLike.Userid = dbUser._id;
          Comment.Replies.forEach(reply => {
            if (reply.ReplyId === reqObj.ReplyId) return reply.Likes.push(newReplyLike);
            return null;
          });
        }
        return dbItem.save(err3 => {
          if (err3) return cb(err3);
          return cb(null, { SUCCESS: 'New Response Saved.' });
        });
      });
    });
  },
  getActiveBids(userId, cb) {
    User.findById(userId, (err1, dbUser) => {
      Item.find({ Owner: dbUser._id }, (err2, usersItems) => {
        if (err1 || err2) return cb(err1 || err2);
        const activeItems = usersItems.map(item => {
          if (item.Status === 'Active') return item;
          return null;
        });
        return cb(null, activeItems);
      });
    });
  },
  getWatchList(userId, cb) {
    User.findById(userId, (err1, dbUser) => {
      Item.find({ _id: { $in: dbUser.Watchlist } }, (err2, dbItems) => {
        if (err1 || err2) return cb(err1 || err2);
        return cb(null, dbItems);
      });
    });
  },
  updateBid(reqObj, userId, cb) {
  // reqObj = {
  //   ItemId  :
  //   Ammount :
  // }
  // userId = req.params.id
    User.find(userId, (err1, dbUser) => {
      Item.find(reqObj.ItemId, (err2, dbItem) => {
        if (err1 || err2) return cb(err1 || err2);
        const thisUser = dbUser;
        const thisItem = dbItem;
        const newBid = { UserId: dbUser._id, Ammount: reqObj.Ammount };
        thisUser.Bids.push(reqObj.ItemId);
        thisItem.Bids.push(newBid);
        thisItem.HighestBid = newBid;
        return thisItem.save((err3, savedItem) => {
          thisUser.save((err4, savedUser) => {
            if (err3 || err4) return cb(err3 || err4);
            return cb(null, { savedItem, savedUser });
          });
        });
      });
    });
  },
  removeWatch(reqObj, userId, cb) {
    User.find(userId, (err1, dbUser) => {
      if (err1) return cb(err1);
      dbUser.Watchlist.filter(item => item !== reqObj.ItemId);
      return dbUser.save((err, savedUser) => {
        if (err) return cb(err);
        return cb(null, savedUser);
      });
    });
  },
  getStats(userId, cb) {
    User.find(userId, (err1, dbUser) => {
      Item.find({ _id: { $in: dbUser.Wins } }, (err2, dbWinItems) => {
        Item.find({ _id: { $in: dbUser.Losses } }, (err3, dbLossItems) => {
          if (err1 || err2 || err3) return cb(err1 || err2 || err3);
          return cb(null, { dbWinItems, dbLossItems });
        });
      });
    });
  },
};

module.exports = Profile;
