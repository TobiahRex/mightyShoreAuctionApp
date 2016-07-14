const express = require('express');
const router = new express.Router();
const PhoneToken = require('../models/PhoneToken');

router.get('/:id', (req, res) => PhoneToken.generate(req.params.id, res.handle));

module.exports = router;
