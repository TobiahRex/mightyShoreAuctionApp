const express = require('express');
const router = new express.Router();
const Profile = require('../models/profile');

router.route('/:id/account')
.get((req, res) => Profile.getAccount(req.params.id, res.handle))
.post((req, res) => Profile.updateAccount(req.body, req.params.id, res.handle));

module.exports = router;
