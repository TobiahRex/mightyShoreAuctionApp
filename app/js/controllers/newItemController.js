function newItemController($scope, $state, Items) {
  // TODO : Create Items Service
  function renderNew() {
    Items.getAll()
    .then(res => {
      $scope.items = res.data;
    })
    .catch(err => {
      $scope.items = err;
    });
  }
  $scope.$on('getNewItems', () => renderNew());
}

angular.module('MightyShore').controller('newItemController', newItemController);
