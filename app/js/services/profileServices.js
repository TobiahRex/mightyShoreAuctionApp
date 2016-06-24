'use strict';

angular.module('MightyShore')
.service('Profile', function($http){

    this.getNewItems    = userId => $http.get(`/api/profile/${userId}/new_items`);

    this.getOffers      = userId => $http.get(`/api/profile/${userId}/new_bids`);

    this.getPendingBids = userId => $http.get(`/api/profile/${userId}/get_pending`);

    this.getWatchList   = userId => $http.get(`/api/profile/${userId}/get_watchlist`);

    this.getStats       = userId => $http.get(`/api/profile/${userId}/get_stats`);

    this.getAccount     = userId => $http.get(`/api/profile/${userId}/get_account`);

    this.getChats       = userId => $http.get(`/api/profile/${userId}/get_chats`);
});


class Profile {
  getNewitems(userId){

  }
}
