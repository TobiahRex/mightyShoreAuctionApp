'use strict';

let express = require('express');
let router  = express.Router();
let Item    = require('../models/item');

router.route('/')
.get((req, res) => {
  Item.find({}, res.handle);
})
.post((req, res) => {
  Item.newItem(req.body, res.handle);
})
.delete((req, res) => {
  Item.remove({}, res.handle);
});

router.route('/:id')
.get((req, res) => {
  Item.getItem(req.params.id, res.handle);
})
.put((req, res) => {
  let editObj = {id : req.params.id, body : req.body};
  Item.updateItem(editObj, res.handle);
})
.delete((req, res) => {
  Item.deleteItem(req.params.id, res.handle);
});

module.exports = router;
