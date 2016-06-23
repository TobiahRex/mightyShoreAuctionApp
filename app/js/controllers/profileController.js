'use strict';

angular.module('MightyShore')
.controller('profileController', function($state, $scope, Auth, dbProfile, Profile){
  console.log('profileCtrl');

  let profileObj = dbProfile;
  $scope.profile = profileObj.data;

  $scope.newItems = () => $scope.$broadcast('getNewItems'); // listener @ newItemController
});
