'use strict';

require('dotenv').load();

const express         = require('express');
const router          = express.Router();
const JWT             = require('jsonwebtoken');
const request         = require('request');
const QS              = require('querystring');
const JWT_SECRET      = process.env.JWT_SECRET;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const User            = require('../models/user');


router.post('/facebook', (req, res)=>{
  console.log('req: ', req.body);
  let fields = ['id', 'email', 'first_name', 'last_name', 'gender', 'link', 'name', 'picture', 'cover'];
  let accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  let params = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : FACEBOOK_SECRET,
    redirect_uri  : req.body.redirectUri
  };

  request.get({
    url   :   accessTokenUrl,
    qs    :   params,
    json  :   true
  }, (err, response, accessToken)=>{
    console.log('this is your error: ', accessToken);
    if(response.statusCode !== 200) return res.status(400).send({ERROR : accessToken.error.message});
    console.log('accessToken RECEIVED: \n', accessToken);

    request.get({
      url   :   graphApiUrl,
      qs    :   accessToken,
      json  :   true
    }, (err, response, profile)=>{
      if(response.statusCode !== 200) return res.status(400).send({ERROR : profile.error.message});
      console.log('facebook profile RECEIVED: \n', accessToken);

      if(req.header('Authorization')) {
        User.findOne(profile.id, (err, dbUser)=>{
          if(dbUser) return res.status(400).send({ERROR : 'You have already signed in with Facebook. Please Login.'});

          let token = req.header('Authorization').split(' ')[1];
          let payload = JWT.verify(token, JWT_SECRET);
          console.log('PAYLOAD: ', payload);

          User.findById(payload._id, (err, dbUser)=>{
            if(!dbUser) return res.status(400).send({ERROR : 'User not found'});

            dbUser.Email              = profile.email;
            dbUser.Firstname          = profile.first_name;
            dbUser.Lastname           = profile.last_name;
            dbUser.Social.facebookId  = profile.id;
            dbUser.Social.facebookLink= profile.link;
            dbUser.Avatar             = dbUser.Avatar || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            dbUser.CoverPhoto         = profile.cover.source;
            dbUser.Username           = dbUser.Username || profile.name;

            dbUser.save((err, savedUser)=>{
              if(err) return res.status(400).send({ERROR : `Could not save user | Details ${err}`});
              let token = dbUser.createToken();
              req.user = savedUser;
              res.send(token);
            });
          });
        });
      } else {
        User.findOne(profile.id, (err, dbUser)=>{
          if(dbUser){
            let token = dbUser.createToken();
            return res.send({token});
          };

          let newUser = new User({
            Email              : profile.email,
            Firstname          : profile.first_name,
            Lastname           : profile.last_name,
            Social             : {facebookLink : profile.link, facebookId : profile.id},
            Avatar             : 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large',
            CoverPhoto         : profile.cover.source,
            Username           : profile.name
          });

          newUser.save((err, savedUser)=>{
            console.log('err: ', err);
            if(err) return res.status(400).send({ERROR : `Could not save new User | Details : ${err}`});
            let token = savedUser.createToken();
            console.log('new SAVED USER: \n', savedUser);
            res.send({token});
          });
        });
      };
    });
  });
});

module.exports = router;
