'use strict';

angular.module('MightyShore')
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('splash', {
    url             :    '/',
    templateUrl     :    'html/splash.html',
    controller      :    'splashController'
  })
  .state('home', {
    url             :    '/home',
    templateUrl     :    'html/home.html',
    controller      :    'homeController',
    resolve         :    {
      allItems   :  function(Items, $q, $state){
        return Items.getAll()
        .catch(err => {
          $scope.allItems = err;
          return $q.reject();
        });
      }
    }
  })
  .state('register', {
    url             :    '/register',
    templateUrl     :    'html/sign_in/register.html',
    controller      :    'registerController'
  })
  .state('verify', {
    url             :    '/verify',
    templateUrl     :    'html/sign_in/verify.html'
  })
  .state('verified', {
    url             :    '/verified',
    templateUrl     :    'html/sign_in/verified.html'
  })
  .state('unverified', {
    url             :    '/unverified',
    templateUrl     :    'html/sign_in/unverified.html'
  })
  .state('login', {
    url             :    '/login',
    templateUrl     :    'html/sign_in/login.html',
    controller      :    'loginController'
  })
  .state('logout', {
    url             :    '/logout',
    controller      :    'logoutController'
  })
  .state('forgot', {
    url             :    '/forgot',
    templateUrl     :    'html/sign_in/forgot.html',
    controller      :    'forgotController'
  })
  .state('profile', {
    url             :     '/profile',
    templateUrl     :     'html/profile.html',
    controller      :     'profileController',
    resolve         :     {
      profile   :     function(Auth, $q, $state){
        return Auth.getProfile()
        .catch(()=>{
          $state.go('login');
          return $q.reject();
        });
      }
    }
  });

  $urlRouterProvider.otherwise('/');
});
