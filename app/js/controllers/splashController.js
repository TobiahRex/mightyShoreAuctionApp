function splashController($scope, $state) {
  console.log('splashCtrl');

  $scope.goToHome = () => {
    $state.go('home');
  };
}

angular.module('MightyShore').controller('splashController', splashController);
