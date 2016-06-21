'use strict';

angular.module('MightyShore')
.service('Auth', function($http){

  this.loginUser = userObj => $http.post('/api/users/login', userObj);

  this.logoutUser = () => $http.delete('/api/users/login');

  this.registerUser = userObj => $http.post('/api/users/register', userObj);

  this.getProfile = () => $http.get('/api/users/profile');

});
