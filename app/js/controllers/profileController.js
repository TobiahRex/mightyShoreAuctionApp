function profileController($state, $scope, Auth, dbProfile) {
  console.log('profileCtrl');
  const profileObj = dbProfile;  // entire profile
  $scope.profile = profileObj.data;

  $scope.newItems = () => $scope.$broadcast('getNewItems'); // listener @ newItemController
}

angular.module('MightyShore').controller('profileController', profileController);
