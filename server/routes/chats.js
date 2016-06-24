'use strict';

const express = require('express');
const router  = express.Router();


router.route('/:id/chat')
.get((req, res)=> Profile.getChats(req.params.id, res.handle))
.post((req, res)=> {  req.body.UserId = req.params.id;Profile.updateChats(req.body, res.handle)});
// reqObj = {
//   UserId  :
//   ItemId  :
//   Ammount :
// }
// Users responses
// save new Replies /Comments
// req.body = {
//   Like      : false / true,
//   Reply     : false / true,
//   ReplyLike : false / true,
//   ItemId   :
//   UserId   :
//   CommentId :
//   ReplyId   :
//   ReplyBody :
// };
// req.body = {
//   Item_id :
//   User_id :
//   New_Bid :
// };


module.exports = router;
