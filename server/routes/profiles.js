'use strict';

const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const Item    = require('../models/item');
const Profile = require('../models/profile');

router.route('/:id/new_items')
.get((req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    if(err) res.status(400).send(err);
    Profile.getNewItems(dbuser, res.handle);
    });
  })
})
.post((req, res) => {
  Profile.saveResponse(req.body, res.handle);
  // this would be making a bid from the new Items page
  // ---------SEND this to Profiles Model----------
  // req.body = {
  //   Item_id :
  //   User_id :
  //   New_Bid :
  // };
});

router.route('/:id/offers')
.get((req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :

    // Get User.Items
    // Get User.LastLogin
    // -----------------------Create a Method
    // Filter Items since last login =>
    //
    // Items.forEach(item => lastLogin < item.Created ? item : null ); // ish
    // -----------------------
    // Get Users from Comments & Reply ID's.
    // - Send Array of User Id
    //  1) For Comments
    //  2) For Replies
    //
    // Build Custom Obj
    // let offerObj = {
    //  Offers : [ [Item , [Comments, [Replies] ] ]  ]
    // }

  })
})
.post((req, res)=> {
  // Saving new Replies or Comments (api post @ click)
  // req.body = {
  //   Like      : false / true,
  //   Reply     : false / true
  //   Item_id   :
  //   User_id   :
  //   CommentId :
  //   ReplyBody :
  // };
  // --------------SEND to Model ---------------
  Item.findById(req.body.Item_id, (err, dbItem)=> {
    if(err) res.status(400).send(err);
    // find Comment
    let Comment = dbItem.Comments.map(comment => {
      return comment.CommentId === req.body.CommentId ? comment : null;
    });

    // Determine what types of response to insert
    let responseObj = {}
    if(req.body.Like) {
      responseObj.LikeId = uuid();
      responseObj.UserId = req.body.User_id;
      Comment.Likes.push(resObj);
    } else {
      responseObj.ReplyId = uuid();
      responseObj.UserId  = req.body.User_id;
      Comment.Replies.push(resObj);
    };
    // Save
    dbItem.save(err=>
      res.status(err ? 400 : 200).send(err || {SUCCESS : `New Response Saved as ${resObj}`});
    );
  });
});

router.get('/:id/get_pending', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_watchlist', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_stats', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_account', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

router.get('/:id/get_chats', (req, res)=> {
  User.findById(req.params.id, (err, dbUser)=> {
    err ? res.status(400).send(err) :



  })
});

module.exports = router;
