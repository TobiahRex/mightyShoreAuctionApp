function loginController($scope, $state, $auth) {
  console.log('loginCtrl');
  $scope.loginUser = loginObj => {
    $auth.login(loginObj)
    .then(dataObj => {
      if (dataObj.status !== 200) console.log('login failed.', dataObj.data);
      $scope.$emit('loggedIn');
      $state.go('profile');
    })
    .catch(err => console.log('ERROR: ', err));
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
    .then(() => $scope.$emit('loggedIn'))
    .catch(err => console.error('ERROR: login error', err));
  };
}

angular.module('MightyShore').controller('loginController', loginController);
