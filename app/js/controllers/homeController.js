function homeController($scope, $state, Items, allItems) {
  console.log('homeCtrl');

  const allItemsObj = allItems;
  $scope.allItems = allItemsObj.data;
}

angular.module('MightyShore').controller('homeController', homeController);
