'use strict';

const express = require('express');
const router  = express.Router();
const Item    = require('./item');

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
  }
};


module.exports = Profile;
