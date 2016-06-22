'use strict';

angular.module('MightyShore')
.controller('profileController', function($state, $scope, Auth){
  console.log('profileCtrl');

  Auth.getProfile().then(res=> {
      $scope.profile = res.data;
  });
});
