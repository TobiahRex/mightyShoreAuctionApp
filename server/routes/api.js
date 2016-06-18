'use strict';

let express = require('express');
let router  = express.Router();

router.use('/users', require('./users'));
router.use('/items', require('./items'));


module.exports = router;
