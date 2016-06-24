'use strict';

const mongoose = require('mongoose');
const User     = require('./user');
const moment   = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

let itemSchema = new mongoose.Schema({
  Owner       :   {
    type        :   ObjectId,
    ref         :   'User',
    required    :   true
  },
  Status      :   {
    type        :   String,
    enum        :   ['Active', 'Expired', 'Sold'],
    required    :   true
  },
  RenderDate  :   {
    type        :     Date
  },
  Created     :   {
    type        :     Date
  },
  Title       :   {
    type        :   String,
    required    :   true
  },
  Description :   {
    type        :     String,
    required    :     true
  },
  Condition   :   {
    type   :   String
  },
  Quantity    :   {
    type   :   Number
  },
  Price       :   {
    type   :   Number
  },
  Likers      :   [{
    type        :   ObjectId,
    ref         :   'User'
  }],
  HighestBid  :   {  // = LAST BID
    UserId       :   {
      type       :  ObjectId,
      ref       :   'User'
    },
    Ammount     :   {
      type        :  Number
    }
  },
  Bids        :   [{
    UserId    :   {
      type        :   ObjectId,
      ref         :   'User'
    },
    Ammount     :   {
      type        :     Number
    },
    BidDate    :   {
      type        :     Date
    }
  }],
  Comments    :   [{
    UserId      :   {
      type      :     ObjectId,
      ref       :     'User'
    },
    CommentId   :   {  // uuid
      type      :   String
    },
    CommentDate :   {
      type      :     Date
    },
    Body        :   {
      type      :    String
    },
    Time        :   {
      type      :     Date
    },
    Likes       :   [{
      LikeId      :   { //uuid
        type      :     String
      },
      UserId      :   {
        type      :   ObjectId,
        ref       :   'User'
      }
    }],
    Replies     :   [{
      UserId      :   {
        type      :   ObjectId,
        ref       :   'User'
      },
      ReplyId     :   { // uuid
        type      :   String
      },
      Body        :   {
        type      :   String
      },
      ReplyDate   :   {
        type      :   Date
      },
      Likes       :   [{
        LikeId      :   { //uuid
          type      :     String
        },
        UserId      :   {
          type      :   ObjectId,
          ref       :   'User'
        }
      }] // reply likes
    }] // replies
  }],
  Categories  :   [{
    type      :   String
  }],
  Tags        :   [{
    type      :   String
  }]
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
