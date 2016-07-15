function Auth($http) {
  this.getUsers = () => $http.get('/api/users');

  this.getUser = id => $http.get(`/api/users/${id}`);

  this.loginUser = userObj => $http.post('/api/users/login', userObj);

  this.logoutUser = () => $http.post('/api/users/logout');

  this.registerUser = userObj => $http.post('/api/users/register', userObj);

  this.getProfile = () => $http.get('/api/users/profile');

  this.toggleAdmin = id => $http.put(`/api/users/${id}/toggle_admin`);
}

angular.module('MightyShore').service('Auth', Auth);
