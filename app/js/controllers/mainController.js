function mainController($scope, $state, Auth) {
  function loginCheck() {
    Auth.getProfile()
    .then(res => {
      $scope.currentUser = res.data;
      $state.go('profile', { id: res.data._id });
    })
    .catch(() => {
      $scope.currentUser = null;
      $state.go('login');
    });
  }
  loginCheck();
  $scope.$on('loggedIn', () => loginCheck());
  $scope.$on('loggedOut', () => loginCheck());
}

angular.module('MightyShore').controller('mainController', mainController);
