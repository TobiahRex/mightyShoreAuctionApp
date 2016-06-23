'use strict';

angular.module('MightyShore')
.controller('profileController', function($state, $scope, Auth, profile){
  console.log('profileCtrl');

  let profileObj = profile;
  $scope.profile = profileObj.data;

  $scope.newItems = () => $scope.$broadcast('getNewItems'); // listener @ newItemController
});
