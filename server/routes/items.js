const express = require('express');
const router = new express.Router();
const Item = require('../models/item');


// For User Profile Data
router.route('/:id/new_items')
.get((req, res) => Item.getNewItems(req.params.id, res.handle))
.post((req, res) => Item.saveResponse(req.body, res.handle));

router.route('/:id')
.get((req, res) => Item.getItem(req.params.id, res.handle))
.put((req, res) => {
  const editObj = { id: req.params.id, body: req.body };
  Item.updateItem(editObj, res.handle);
})
.delete((req, res) => Item.deleteItem(req.params.id, res.handle));

router.route('/')
.get((req, res) => Item.find({}, res.handle))
.post((req, res) => Item.newItem(req.body, res.handle))
.delete((req, res) => Item.remove({}, res.handle));

module.exports = router;
