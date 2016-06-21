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
    controller      :    'homeController'
  })
  .state('register', {
    url             :    '/register',
    templateUrl     :    'html/sign_in/register.html',
    controller      :    'registerController',
    controllerAs    :    'registerCtrl'
  })
  .state('login', {
    url             :    '/login',
    templateUrl     :    'html/sign_in/login.html',
    controller      :    'loginController',
    controllerAs    :    'loginCtrl'
  })
  .state('logout', {
    url             :    '/logout',
    templateUrl     :    'html/sign_in/logout.html',
    controller      :    'logoutController',
    controllerAs    :    'logoutCtrl'
  })
  .state('forgot', {
    url             :    '/forgot',
    templateUrl     :    'html/sign_in/forgot.html',
    controller      :    'forgotController',
    controllerAs    :    'forgotCtrl'
  })
  $urlRouterProvider.otherwise('/');
});
