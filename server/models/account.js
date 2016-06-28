'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = require('./user');
const Item = require('./item');

let accountSchema = new mongoose.Schema({
  UserId    :     {
    type      :     ObjectId,
    ref       :     'User'
  },
  Available :     {
    type      :     Number
  },
  Equity    :     {
    type      :     Number
  },
  Deposits  :     {
    depId     :     {
      type      :     String
    },
    amount    :     {
      type      :     Number
    },
    depDate   :     {
      type      :     Date,
      default   :     Date.now
    }
  },
  Withdrawals :   {
    withdId   :     {
      type      :     String
    }
    amount    :     {
      type      :     Number
    },
    reqDate   :     {
      type      :     Date,
      default   :     Date.now
    },
    settleDate:     {
      type      :     Date,
      default   :     Date.now
    }
  },
  Frozen      :    {
    freezeId    :   {
      type        :   String
    },
    targetId    :   {
      type        :   ObjectId,
      ref         :   'Item'
    },
    freezeDate  :   {
      type        :   Date,
      default     :   Date.now
    },
    settleDate  :   {
      type        :   Date,
      default     :   Date.now
    }
  },
  ItemsPurchased:   {
    purchaseId  :   {
      type        :   String
    },
    amount      :   {
      type        :   Number
    },
    payMethod   : {
      type        :   String,
      enum        :   ['Credit', 'Debit', 'ACH', 'Bitcoin']
    },
    itemId      : {
      type        :   ObjectId,
      ref         :   'Item'
    },
    fromUser    : {
      type        :   ObjectId,
      ref         :   'User'
    }
  },
  ItemsSold :     {
    soldId    :    {
      type      :   String
    },
    amount      :   {
      type        :   Number
    },
    payMethod   : {
      type        :   String,
      enum        :   ['Credit', 'Debit', 'ACH', 'Bitcoin']
    },
    itemId      : {
      type        :   ObjectId,
      ref         :   'Item'
    },
    fromUser    : {
      type        :   ObjectId,
      ref         :   'User'
    }

  }
});

let Account = mongoose.model('Account', accountSchema);
module.exports = Account;
