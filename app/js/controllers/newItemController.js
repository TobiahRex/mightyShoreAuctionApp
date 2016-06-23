'use strict';

angular.module('MightyShore')
.controller('newItemController', function($scope, $state, Items){

// TODO : Create Items Service

    function renderNew(){
      Items.getAll()
      .then(res => {
        $scope.items = res.data;
      })
      .catch(err => {
        $scope.items = err;
      })
    };

    $scope.$on('getNewItems', function(){renderNew()});
});
