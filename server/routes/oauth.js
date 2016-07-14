require('dotenv').load();
const express = require('express');
const router = new express.Router();
const JWT = require('jsonwebtoken');
const request = require('request');
const JWT_SECRET = process.env.JWT_SECRET;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const User = require('../models/user');

router.post('/facebook', (req, res) => {
  const fields = [
    'id',
    'link',
    'name',
    'email',
    'cover',
    'gender',
    'picture',
    'last_name',
    'first_name',
  ];
  const accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  const graphApiUrl = `https://graph.facebook.com/v2.5/me?fields=${fields.join(',')}`;
  const params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri,
  };
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true,
  }, (err1, response1, accessToken) => {
    if (err1 || response1.statusCode !== 200) {
      res.status(400).send(err1 || { ERROR: accessToken.error });
    }
    console.log('accessToken RECEIVED: \n', accessToken);
    return request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true,
    }, (err2, response2, profile) => {
      if (response2.statusCode !== 200) res.status(400).send({ ERROR: profile.error });
      console.log('facebook profile RECEIVED: \n', accessToken);
      if (req.header('Authorization')) {
        User.findOne(profile.id, (err3, user1) => {
          let dbUser = user1;
          if (err3 || dbUser) {
            return res.status(400)
            .send(err3 || { ERROR: 'You have already signed in with Facebook.' });
          }
          let token = req.header('Authorization').split(' ')[1];
          const payload = JWT.verify(token, JWT_SECRET);
          console.log('PAYLOAD: ', payload);

          return User.findById(payload._id, (err4, user2) => {
            dbUser = user2;
            if (err4 || !dbUser) return res.status(400).send(err4 || { ERROR: 'User not found' });

            dbUser.Email = profile.email;
            dbUser.Firstname = profile.first_name;
            dbUser.Lastname = profile.last_name;
            dbUser.Social.facebookId = profile.id;
            dbUser.Social.facebookLink = profile.link;
            dbUser.LastLogin = Date.now();
            dbUser.Avatar = dbUser.Avatar || `https://graph.facebook.com/v2.3/${profile.id}/picture?type=large`;
            dbUser.CoverPhoto = profile.cover.source;
            dbUser.Username = dbUser.Username || profile.name;

            return dbUser.save((err, savedUser) => {
              if (err) {
                return res.status(400).send({ ERROR: `Could not save user | Details ${err}` });
              }
              token = dbUser.createToken();
              req.user = savedUser;
              return res.send(token);
            });
          });
        });
      } else {
        User.findOne(profile.id, (err3, dbUser) => {
          let token;
          if (dbUser) {
            token = dbUser.createToken();
            return res.send({ token });
          }
          const newUser = new User({
            Email: profile.email,
            Firstname: profile.first_name,
            Lastname: profile.last_name,
            Social: { facebookLink: profile.link, facebookId: profile.id },
            Avatar: `https://graph.facebook.com/v2.3/${profile.id}/picture?type=large`,
            CoverPhoto: profile.cover.source,
            LastLogin: Date.now(),
            Username: profile.name,
          });

          return newUser.save((err4, savedUser) => {
            console.log('err: ', err4);
            if (err4) {
              res.status(400).send({ ERROR: `Could not save new User | Details : ${err4}` });
            }
            token = savedUser.createToken();
            console.log('new SAVED USER: \n', savedUser);
            res.send({ token });
          });
        });
      }
    });
  });
});

module.exports = router;
