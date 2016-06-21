'use strict';

angular.module('MightyShore')
.service('Auth', function($http){

  this.loginUser = userObj => $http.post('/login', userObj);

  this.logoutUser = () => $http.delete('/logout');

  this.registerUser = userObj => $http.post('/register', userObj);

  this.getProfile = () => $http.get('/profile');

});
