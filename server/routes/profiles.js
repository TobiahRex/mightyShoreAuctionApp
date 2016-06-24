'use strict';

const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const Item    = require('../models/item');
const Profile = require('../models/profile');

router.route('/:id/new_items')
.get((req, res) => Profile.getNewItems(req.params.id, res.handle))
.post((req, res) => Profile.saveResponse(req.body, res.handle); // ---------req.body----------
  // req.body = {
  //   Item_id :
  //   User_id :
  //   New_Bid :
  // };
);

router.route('/:id/auctions') // Users's posted items for Auction
.get((req, res)=> Profile.getNewBids(req.params.id, res.handle)) // Bids other Users have made on Users' items.
.post((req, res)=> { req.body.User_id = req.params.id; Profile.saveResponse(req.body, res.handle);});
// Users responses
    // save new Replies /Comments
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

router.get('/:id/activebids', (req, res)=> Profile.getActiveBids(req.params.id, res.handle));

router.route('/:id/watchlist')
.get((req, res)=> Profile.getWatchList(req.params.id, res.handle))
.post((req, res)=>{ req.body.UserId = req.params.id; Profile.updateBid(req.body, res.handle);})
    // reqObj = {
    //   UserId  :
    //   ItemId  :
    //   Ammount :
    // }

.delete((req, res)=> { req.body.UserId = req.params.id; Profile.removeWatch(req.body, res.handle);});

router.get('/:id/stats', (req, res)=> Profile.getStat(req.params.id, res.handle));

router.route('/:id/account')
.get((req, res)=> Profile.getAccount(req.params.id, res.handle))
.post((req, res)=> { req.body.UserId = req.params.id; Profile.updateAccount(req.body, res.handle)});

router.route('/:id/chat')
.get((req, res)=> Profile.getChats(req.params.id, res.handle))
.post((req, res)=> {  req.body.UserId = req.params.id;Profile.updateChats(req.body, res.handle)});

module.exports = router;
