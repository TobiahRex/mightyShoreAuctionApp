const express = require('express');
const router = new express.Router();
const path = require('path');
const indexPath = path.join(__dirname, '../../public/index.html');

router.use('/', (req, res) => res.sendFile(indexPath));

module.exports = router;
