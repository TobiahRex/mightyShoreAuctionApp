'use strict';

angular.module('MightyShore')
.controller('mainController', function($scope, $state, Auth){

  function loginCheck(){
    Auth.getProfile()
    .then(res => {
      $scope.currentUser = res.data;
      $state.go('profile', {id : res.data._id});
    })
    .catch(err => {
      console.log('login error: ', err);
      $scope.currentUser = null;
      $state.go('login');
    });
  };

  loginCheck();

  $scope.$on('loggedIn', function(){loginCheck()});
  $scope.$on('loggedOut', function(){loginCheck()});

});
