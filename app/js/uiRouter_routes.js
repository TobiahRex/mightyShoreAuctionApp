'use strict';

angular.module('MightyShore')
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('splash', {
    url             :    '/',
    templateUrl     :    'html/splash.html',
    controller      :    'splashController'
  })
  .state('register', {
    url             :    '/register',
    templateUrl     :    'html/register.html',
    controller      :    'registerController',
    controllerAs    :    'registerCtrl'
  })
  .state('login', {
    url             :    '/login',
    templateUrl     :    'html/login.html',
    controller      :    'loginController',
    controllerAs    :    'loginCtrl'
  })
  .state('logout', {
    url             :    '/logout',
    templateUrl     :    'html/logout.html',
    controller      :    'logoutController',
    controllerAs    :    'logoutCtrl'
  })
  .state('forgot', {
    url             :    '/forgot',
    templateUrl     :    'html/forgot.html',
    controller      :    'forgotController',
    controllerAs    :    'forgotCtrl'
  })
  $urlRouterProvider.otherwise('/');
});
