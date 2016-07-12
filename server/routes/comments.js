'use strict';

const express  = require('express');
const router   = express.Router();
const Comment  = require('../models/comment');
const mongoose = require('mongoose');

router.route('/')
.get((req, res)=> Comment.find({}, res.handle))
.delete((req, res)=> Comment.remove({}, res.handle));

router.post('/:user/new/:person', (req, res)=> {
  let reqBody = {
    user    : req.params.user,
    person  : req.params.person,
    comment : req.body
  };
  Comment.addComment(reqBody, res.handle);
});

router.post('/:commId/like/:person', (req, res)=> {
  let reqBody = {
    commId    : req.params.commId,
    personId  : req.params.person
  }
});

router.get('/populate', (req, res)=> Comment.populateAll(res.handle));

module.exports = router;
