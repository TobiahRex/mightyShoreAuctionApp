function logoutController($scope, $state, $auth, Auth, toastr) {
  console.log('logoutCtrl');
  Auth.logoutUser()
  .then(() => {
    $auth.logout();
    toastr.info('You have been successfully logged out.',
    'Logged Out', { iconClass: 'toast-logout' });
    $scope.$emit('loggedOut');
  });
}

angular.module('MightyShore').controller('logoutController', logoutController);
