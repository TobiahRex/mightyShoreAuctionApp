'use strict';

require('dotenv').load();

const express         = require('express');
const router          = express.Router();
const JWT             = require('jsonwebtoken');
const request         = require('request');
const QS              = require('querystring');
const JWT_SECRET      = process.env.JWT_SECRET;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const User            = require('./user');


router.post('/facebook', (req, res)=>{
  let fields = ['id', 'email', 'first_name', 'last_name', 'gender', 'link', 'name', 'picture', 'cover'];
  let accessToken = 'https://graph.facebook.com/v2.5/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  let params = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : FACEBOOK_SECRET,
    redirect_uri  : req.body.redirect_uri
  };




});
