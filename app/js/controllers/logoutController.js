'use strict';

angular.module('MightyShore')
.controller('logoutController', function($scope, $state, $auth, Auth, toastr){
  console.log('logoutCtrl');

  Auth.logoutUser()
  .then(res => {
    $auth.logout();
    toastr.info('You have been successfully logged out.', 'Logged Out', {iconClass : 'toast-logout'})
    $scope.$emit('loggedOut');
  });
});
