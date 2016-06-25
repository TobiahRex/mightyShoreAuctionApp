'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;



// var UserGroupSchema = new Mongoose.schema({ 
//   users : [{
//     type : ObjectId,
//     ref : 'mycollection'
//   }]
// }); 
//
// var group = new UserGroup({
//   users : [myDocument._id]
// });
//
// group.save(()=> {
//   UserGroup
//   .find()
//   .populate('users')
//   .exec((error, groups)=>{
//     // Groups contains every document in usergroups with users field populated // Prints 'Val' 
//     console.log(groups[0][0].name)
//   });
// });
//
//
// var UserGroup = myConnection.model('usergroups', UserGroupSchema);

let ImageSchema = new Mongoose.Schema({
  url     : {
    type    : String
  }, 
  created : {
    type    : Date,
    default : Date.now
  }
}); 
////////////////////////////////////////////////////////

// let UserSchema = new Mongoose.Schema({ 
//   username : {
//     type    : String }, 
//     image   : {
//       type    : ObjectId,
//       ref     : 'images'
//     }
//   }); 

  ////////////////////////////////////////////////////////
  let Group = new Mongoose.Schema({ 
    users : [{
      type  : ObjectId,
      ref   : 'users'
    }]
  });

  // Group =
  {
    users : [{
      username  : 'bobTheBuilder',
      image     : {
        url       : 'asdfasdf',
        created   : 123412341
      }
    }]
  }
  //
  // Group.find({})
  // .populate('user')
  // .populate('user.image')
  // .exec((error, groups)=>{
  //   groups[0].users[0].username; // OK 
  //   groups[0].users[0].greet(); // ERROR – greet is undefined => that makes sense because JSON/BSON cannot stringify functions.
  //
  //   groups[0].users[0].image; // Is still an object id, doesn't get populated
  //   groups[0].users[0].image.created; // Undefined
  // });

  var UserSchema = new Mongoose.Schema({
    username  : {
      type      : String
    }, 
    image     : [ImageSchema]
  });

  Group
  .find({})
  .populate('user')
  .exec((error, groups)=>{
    groups[0].users[0].image.created; // Date associated with image
  });

  UserSchema.methods.greet = function() {
    return 'Hello, ' + this.name;
  };



  let User  = db.model('users'  , UserSchema);
  let Image = db.model('images' , ImageSchema);
