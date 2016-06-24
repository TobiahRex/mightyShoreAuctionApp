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

router.route('/:id/new_bids')
.get((req, res)=> Profile.getNewBids(req.params.id, res.handle))
.post((req, res)=> {  // Saving new Replies or Comments (api post @ click) ------- req.body = {
    //   Like      : false / true,
    //   Reply     : false / true,
    //   ReplyLike : false / true,
    //   ItemId   :
    //   UserId   :
    //   CommentId :
    //   ReplyId   :
    //   ReplyBody :
    // };
  req.body.User_id = req.params.id;
  Profile.saveResponse(req.body, res.handle);
});

router.get('/:id/get_active', (req, res)=> {
  Profile.getActiveBids(req.params.id, res.handle);
});

router.get('/:id/get_watchlist', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_stats', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_account', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_chats', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

module.exports = router;
