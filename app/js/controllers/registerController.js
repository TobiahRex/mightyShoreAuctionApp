'use strict';

angular.module('MightyShore')
.controller('registerController', function($scope, $state, Auth){
  console.log('registerCtrl');

  let userObj = {
    Access      :  'Administrator',
    Name        : {
      first : '',
      last  : ''
    },
    Username    :   '',
    _Password   :   '',
    Email       :   ''
  };

  $scope.registerNewUser = registerObj => {
    //-pwd match
    if(registerObj.password !== registerObj._Password) return console.log('ERROR: Passwords do not match.');

    //-build userObj from registerObj
    userObj.Username  = registerObj.Username;
    userObj._Password = registerObj._Password;
    registerObj.name.split(' ').forEach((name, i) => {
      i === 0 ? userObj.Name.first = name :
      i === 1 ? userObj.Name.last = name :
      null;
    });

    //-submit
    Auth.registerUser(userObj)
    .then(dataObj => {
      $state.go('home');
    });
  };
});
