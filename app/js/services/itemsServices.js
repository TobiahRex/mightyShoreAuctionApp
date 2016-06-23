'use strict';

angular.module('MightyShore')
.service('Items', function($http){


// CRUD

  this.getAll = () => $http.get('/api/items');

  this.newItem = itemObj => $http.post('/api/items', itemObj);

  this.getItem = itemId => $http.get(`/api/items/${itemId}`);

  this.editItem = itemObj => $http.put(`/api/items/${itemObj.id}`, itemObj);

  this.deleteItem = itemId => $http.delete(`/api/items/${itemId}`);

// QUERIES

  




});
