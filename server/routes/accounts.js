'use strict';

const express = require('express');
const router  = express.Router();

router.route('/:id/account')
.get((req, res)=> Profile.getAccount(req.params.id, res.handle))
.post((req, res)=> { req.body.UserId = req.params.id; Profile.updateAccount(req.body, res.handle)});


module.exports = router;
