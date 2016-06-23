'use strict';

const express = require('express');
const router  = express.Router();
const Item    = require('./item');

let Profile = {
  getNewItems(dbUser, cb){
    dbUser.LastLogin
    // Get All Items
    Item.find({}, (err, dbItems)=> {
      if(err) res.status(400).send(err);
      // Filter Items since last login
      let recentItems = dbItems.map(dbItem => return dbUser.LastLogin < dbItem.Created ? item : null);
      let yourBid = highestBid = {};
      recentItems.map(item => {
        item.Bids.map(bid => {
          if(bid.Userid === dbUser._id) yourBid = bid;
          if(bid.Ammount > highestBid.Amount) highestBid = bid;
        });
      });
      let ngObj = { yourBid, recentItems, highestBid };
    }
  },
  saveResponse(reqBody, cb){
    let newBidObj = {
      UserId    : reqBody.User_id,
      Ammounnt  : reqBody.New_Bid,
      BidDate   : Date.now()
    };
    Item.findById(reqBody.Item_id, (err, dbItem) => {
      dbItem.Bids.push(newBidObj);
      dbItem.save(err =>{
        res.status(err ? 400 : 200).send(err || {SUCCESS : `New Bid Saved as ${newBidObj}`});
      });
    });
  }
};


module.exports = Profile;
