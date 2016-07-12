'use strict';

let express = require('express');
let router  = express.Router();

router.use('/users', require('./users'));
router.use('/comments', require('./comments'));
// router.use('/messages', require('./messages'));
router.use('/items', require('./items'));
router.use('/users/profile', require('./profiles'));
router.use('/oauth', require('./oauth'));

module.exports = router;
