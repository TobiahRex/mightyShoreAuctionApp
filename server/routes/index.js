'use strict';

let express = require('express');
let router  = express.Router();
let path    = require('path');

router.use('/', (req, res) => {
  let indexPath = path.join(__dirname, '../../public/index.html');
  res.sendFile(indexPath);
});

module.exports = router;
