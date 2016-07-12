'use strict';

angular.module('MightyShore')
.controller('logoutController', function($scope, $state, $auth, Auth){
  console.log('logoutCtrl');

  Auth.logoutUser()
  .then(res => {
    $auth.logout();
    toastr.info('You have been successfully logged out', 'Logged Out', {iconClass : 'toastr-logout'});
    $scope.$emit('loggedOut');
  });
});
