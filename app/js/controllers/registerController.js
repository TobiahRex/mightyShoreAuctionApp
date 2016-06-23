'use strict';

angular.module('MightyShore')
.controller('registerController', function($scope, $state, Auth){
  console.log('registerCtrl');

  let userObj = {
    Access      :  'Not-Assigned',
    Username    :   '',
    _Password   :   '',
    Firstname   :   '',
    Lastname    :   '',
    Email       :   '',
    Bio         :   '',
    Avatar      :   ''
  };

  $scope.registerNewUser = registerObj => {
    //-pwd match
    if(registerObj.password !== registerObj._Password) return console.log('ERROR: Passwords do not match.');

    //-build userObj from registerObj
    userObj.Username  = registerObj.Username;
    userObj._Password = registerObj._Password;
    userObj.Email     = registerObj.Email;
    userObj.Bio       = registerObj.Bio;
    userObj.Avatar    = registerObj.Avatar || registerObj.AvatarFile;

    registerObj.name.split(' ').forEach((name, i) => {
      i === 0 ? userObj.Firstname = name :
      i === 1 ? userObj.Lastname = name :
      null;
    });

    //-submit
    console.log('userObj: ', userObj);
    Auth.registerUser(userObj)
    .then(dataObj => {
      $state.$emit('loggedIn');
      $state.go('verify');
    })
    .catch(err => {
      console.log('register error: ', err);
      $state.go('home');
    })
  };
});
