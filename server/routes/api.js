'use strict';

let express = require('express');
let router  = express.Router();

router.use('/users', require('./users'));
router.use('/items', require('./items'));
router.use('/users/profile', require('./profiles'));


module.exports = router;
