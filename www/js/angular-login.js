(function() {
  'use strict';

  // INITIALISE DATASERVERAPI
  var app = angular.module("dataserverapi", ['ngRoute']);
  app.factory('loginService', function($http){
    // SIGNUP
    function signupUser(nickname, email, password){
      return $http({
        method: 'POST',
        url: 'http://woutverhoeven.webhosting.be/api/auth/signup',
        params:{
          name: nickname,
          email: email,
          password: password,
        }
      });
    }
    // ====================================================================================
    // GET USER DATA WORKS
    function loginUser(email, password){
      return $http({
        method: 'POST',
        url: 'http://woutverhoeven.webhosting.be/api/auth/login',
        params:{
          email: email,
          password: password,
        }
      });
    }
    // ====================================================================================
    // PASSWORD RESET
    // return data.data
    function forgotPassord(email){
      return $http({
        method: 'POST',
        url: 'http://woutverhoeven.webhosting.be/api/auth/recovery',
        params:{
          email: email,
        }
      });
    }
    // ====================================================================================
    // PASSWORD RESET
    function refreshLoginToken(loginToken){
      return $http({
        method: 'GET',
        url: 'http://woutverhoeven.webhosting.be/api/auth/refresh',
        params:{
          token: loginToken,
        }
      });
    }

    return{
      signupUser: signupUser,
      loginUser: loginUser,
      forgotPassord: forgotPassord,
      refreshLoginToken: refreshLoginToken,
    };
  });
})();
