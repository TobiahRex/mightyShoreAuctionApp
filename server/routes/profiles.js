'use strict';

const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const Item    = require('../models/item');
const Profile = require('../models/profile');

 // PROFILE API

router.route('/:id/auctions') // Users's posted items for Auction
.get((req, res)=> Profile.getNewBids(req.params.id, res.handle)) // Bids other Users have made on Users' items.
.post((req, res)=> { req.body.User_id = req.params.id; Profile.saveResponse(req.body, res.handle);});

router.get('/:id/activebids', (req, res)=> Profile.getActiveBids(req.params.id, res.handle));

router.route('/:id/watchlist')
.get((req, res)=> Profile.getWatchList(req.params.id, res.handle))
.post((req, res)=>{ req.body.UserId = req.params.id; Profile.updateBid(req.body, res.handle);})

.delete((req, res)=> { req.body.UserId = req.params.id; Profile.removeWatch(req.body, res.handle);});

router.get('/:id/stats', (req, res)=> Profile.getStats(req.params.id, res.handle));


module.exports = router;
