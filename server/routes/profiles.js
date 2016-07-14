const express = require('express');
const router = new express.Router();
const Profile = require('../models/profile');

// PROFILE API
router.get('/:id/activebids', (req, res) => Profile.getActiveBids(req.params.id, res.handle));

router.route('/:id/auctions') // Users's posted items for Auction
.get((req, res) => Profile.getNewBids(req.params.id, res.handle)) // new bids
.post((req, res) => Profile.saveResponse(req.body, req.params.id, res.handle));

router.route('/:id/watchlist')
.get((req, res) => Profile.getWatchList(req.params.id, res.handle))
.post((req, res) => Profile.updateBid(req.body, req.params.id, res.handle))
.delete((req, res) => Profile.removeWatch(req.body, req.params.id, res.handle));

router.get('/:id/stats', (req, res) => Profile.getStats(req.params.id, res.handle));

module.exports = router;
