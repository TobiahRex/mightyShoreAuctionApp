'use strict';

angular.module('MightyShore')
.controller('loginController', function($scope, $state, Auth){
  console.log('loginCtrl');
  $scope.loginUser = loginObj => {
    Auth.loginUser(loginObj)
    .then(dataObj =>{
      if(dataObj.status !== 200) return console.log('login failed.', dataObj.data);
      $scope.$emit('loggedIn');
      $state.go('profile');
    });
  };
});
