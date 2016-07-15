function Items($http) {
  this.getAll = () => $http.get('/api/items');

  this.newItem = itemObj => $http.post('/api/items', itemObj);

  this.getItem = itemId => $http.get(`/api/items/${itemId}`);

  this.editItem = itemObj => $http.put(`/api/items/${itemObj.id}`, itemObj);

  this.deleteItem = itemId => $http.delete(`/api/items/${itemId}`);
}

angular.module('MightyShore').service('Items', Items);
