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

router.get('/profile', (req, res)=>{
  console.log('req.cookies: ', req.cookies.accessToken);
  res.send(req.user);
});

router.post('/register', (req, res) => {
  console.log(req.body);
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err || {SUCCESS : `User Registered.`});
  });
});

router.post('/login', (req, res)=>{
  User.authenticate(req.body, (err, tokenPkg ) => {
    err ? res.status(400).send({ERROR : `${err}`}) :
    res.cookie('accessToken', tokenPkg.token).send(tokenPkg);
  });
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
