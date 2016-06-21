'use strict';

angular.module('MightyShore')
.controller('registerController', function($scope, $state, Auth){
  console.log('registerController');

  let userObj = {
    Access      :  'Administrator',
    Name        : {
      first : '',
      last  : ''
    },
    Username    :   '',
    _Password   :   ''
  };

  $scope.submitNewUser = registerObj => {
    console.log(registerObj);
    if(registerObj.password !== registerObj.verifyPwd) return console.log('ERROR: Passwords do not match.');

    userObj.Username  = registerObj.username;
    userObj._Password = registerObj.verifyPwd;

    registerObj.name.split(' ').forEach((name, i) => {
      i === 0 ? userObj.Name.first = name :
      i === 1 ? userObj.Name.last = name :
      null;
    });

    Auth.registerUser(userObj)
    .then(dataObj => {
      console.log('user registered', dataObj.data);
      $state.go('home');
    });
  };


});
