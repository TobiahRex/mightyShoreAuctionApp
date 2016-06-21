'use strict';

angular.module('MightyShore')
.controller('loginController', function($scope, $state, Auth){
  console.log('loginCtrl');

  $scope.loginUser = loginObj => {
    Auth.loginUser(loginObj)
    .then(data =>{
      // if(!data.SUCCESS) return console.log('login failed.');
      console.log('login data: ', data);
      $state.go('home');
    });
  };
  // Auth.getProfile()
  // .done(profile => {
  //   if(!profile.Username){
  //     /* Sweet Alert Error  */
  //     $state.go('/profile')  // use NG resolve to retrieve profile with ngRoute
  //   }
  //
  // });
});
