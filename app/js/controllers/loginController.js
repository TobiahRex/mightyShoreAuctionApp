'use strict';

angular.module('MightyShore')
.controller('loginController', function($scope, $state, $auth, Auth){
  console.log('loginCtrl');
  $scope.loginUser = loginObj => {
    $auth.login(loginObj)
    .then(dataObj =>{
      if(dataObj.status !== 200) return console.log('login failed.', dataObj.data);
      $scope.$emit('loggedIn');
      $state.go('profile');
    })
    .catch(err=> console.log('ERROR: ', err));
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
    .then(res =>$scope.$emit('loggedIn'))
    .catch(err=> console.log('ERROR: login error'))
  };
});
9
