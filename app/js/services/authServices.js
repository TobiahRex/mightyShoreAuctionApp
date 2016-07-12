'use strict';

angular.module('MightyShore')
.service('Auth', function($http){

  this.getUsers = _ => $http.get('/api/users');

  this.getUser = id => $http.get(`/api/users/${id}`);

  this.loginUser = userObj => $http.post('/api/users/login', userObj);

  this.logoutUser = _ => $http.delete('/api/users/login');

  this.registerUser = userObj => $http.post('/api/users/register', userObj);

  this.getProfile = _ => $http.get('/api/users/profile');

  this.toggleAdmin = id => $http.put(`/api/users/${id}/toggle_admin`);

});
