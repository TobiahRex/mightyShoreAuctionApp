function phoneConfirmationService($http){
  this.sendPhoneToken = UserId => $http.post(`/api/users/register_phone/${UserId}/`);

  this.verifyPhoneToken = (UserId, token) => $http.post(`/api/users/verify/`);
};
