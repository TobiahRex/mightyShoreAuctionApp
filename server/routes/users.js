'use strict';

let express = require('express');
let router  = express.Router();
let User    = require('../models/user');

router.route('/')
.get((req, res) =>{
  User.find({}, res.handle);
})
.post((req, res)=> {
  User.newUser(req.body, res.handle);
})
.delete((req, res)=> {
  User.remove({}, res.handle);
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

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err || {SUCCESS : `User Registered.`});
  });
});

router.post('/login', (req, res)=>{
  User.authenticate(req.body, (err, tokenPkg ) => {
    console.log('error: ', err);
    err ? res.status(400).send({ERROR : `${err}`}) :
    res.cookie('accessToken', tokenPkg.token).send(tokenPkg);
  });
});


module.exports = router;
