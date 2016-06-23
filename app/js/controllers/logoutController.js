'use strict';

angular.module('MightyShore')
.controller('logoutController', function($scope, $state, Auth){
  console.log('logoutCtrl');

  Auth.logoutUser()
  .then(res => {
    console.log('user logged out: ', res);
    $scope.$emit('loggedOut');
  });
});
