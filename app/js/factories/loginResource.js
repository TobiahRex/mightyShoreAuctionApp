'use strict';

angular.module('MightyShore')
.factory('Auth', function($resource){
  return $resource('/api/users/:id', {id : '@_id'},
    
  )
})
