'use strict';

let express = require('express');
let router  = express.Router();
let User    = require('../models/user');

router.route('/')
.get((req, res) =>{
  User.find({}, res.handle);
})
.post(req.body, (req, res)=> {
  User.create(req.body, res.handle);
});

module.exports = router;
