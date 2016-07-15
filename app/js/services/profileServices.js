function profileService($http) {
  this.getNewItems = userId => $http.get(`/api/profile/${userId}/new_items`);

  this.getOffers = userId => $http.get(`/api/profile/${userId}/new_bids`);

  this.getPendingBids = userId => $http.get(`/api/profile/${userId}/get_pending`);

  this.getWatchList = userId => $http.get(`/api/profile/${userId}/get_watchlist`);

  this.getStats = userId => $http.get(`/api/profile/${userId}/get_stats`);

  this.getAccount = userId => $http.get(`/api/profile/${userId}/get_account`);

  this.getChats = userId => $http.get(`/api/profile/${userId}/get_chats`);

  this.sendPhoneToken = UserId => $http.post(`/api/users/register_phone/${UserId}/`);

  this.verifyPhoneToken = (UserId, token) =>
  $http.post(`/api/users/verify_phone/${token}/${UserId}`);
}

angular.module('MightyShore').service('Profile', profileService);
