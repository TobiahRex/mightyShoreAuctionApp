'use strict';

const mongoose = require('mongoose');
const User     = require('./user');
const moment   = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

let itemSchema = new mongoose.Schema({
  Status      :   {type   :   String, enum :  ['Active', 'Expired', 'Sold']},
  Added       :   {type   :   Date}, //db data
  SortDate    :   {type   :   Date}, //db data
  Name        :   {type   :   String},
  Condition   :   {type   :   String},
  Quantity    :   {type   :   String},
  Price       :   {type   :   Number},
  Likes       :   {type   :   Number},
  Likers      :   [{type   :   ObjectId, ref   :   'User'}],
  Bids        :   {type   :   Number},
  Bidders     :   [{type    :   ObjectId, ref   :   'User'}],
  Owner       :   {type   :   ObjectId, ref   :   'User', required  :   true },
})

itemSchema.statics.newItem = (itemObj, cb) => {
  if(!itemObj) return cb({ERROR : `Did note provide Item Details. Try again.`});
  Item.create(itemObj, (err, newItem) =>{
    if(err) return cb(err);

    let dbData = {
      Added     : Date.now(),
      SortDate  : moment().format('llll')
    }

  });
};

itemSchema.statics.getItem = (itemId, cb) => {
  if(!itemId) return cb({ERROR : `Did not provide an id. Try again.`});
  Item.findById(itemId, (err, dbItem) => {
    err ? cb(err) : cb(null, dbItem);
  });
};

itemSchema.statics.updateItem = (editObj, cb) => {
  if(!editObj.id) return cb({ERROR : `Did not provide an id. Try again.`});
  Item.findByIdAndUpdate(editObj.id, {$set : editObj.body}, (err, oldDbItem) => {
    err ? cb(err) :
    Item.findById(oldDbItem._id, (err, newDbItem) => {
      err ? cb(err) : cb(null, newDbItem);
    });
  });
};

itemSchema.statics.deleteItem = (itemId, cb) => {
  if(!itemId) return cb({ERROR : `Did not provide an Id. Try again.`});
  Item.findByIdAndRemove(itemId, (err, oldItem) => {
    err ? cb(err) : cb(null, {SUCCESS : `REMOVED - \n ${oldItem}`});
  });
};

let Item = mongoose.model('Item', itemSchema);

module.exports = Item;
