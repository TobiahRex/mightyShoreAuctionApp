'use strict';

let express = require('express');
let router  = express.Router();
let User    = require('../models/user');

router.route('/')
.get((req, res) =>{
  User.find({}, res.handle);
})
.delete((req, res)=> {
  User.remove({}, res.handle);
});

router.get('/profile', User.loginVerify, (req, res)=>{
  res.send(req.user);
});

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send({ERROR : err} || {SUCCESS : `User Registered.`});
  });
});

router.route('/login')
.post((req, res)=> {
  User.authenticate(req.body, (err, tokenPkg ) => {
    if(err) res.status(400).send({ERROR : `${err}`});
    res.cookie('accessToken', tokenPkg.token).status(200).send({SUCCESS : `User is logged in @ Cookie: ${req.cookies.accessToken}`});
  });
})
.delete((req, res)=> {
  res.clearCookie('accessToken').status(200).send({SUCCESS : `User has been Logged out. \n Active Cookies: ${res.cookies.accessToken}`});
});


router.route('/:id')
.get((req, res)=> {
  User.getUser(req.params.id, res.handle);
})
.put((req, res)=> {
  let userObj = {id : req.params.id, body : req.body};
  User.updateUser(userObj, res.handle);
})
.delete((req, res) => {
  User.removeUser(req.params.id, res.handle);
});




module.exports = router;
