(function() {
  'use strict';

  var app = angular.module("dataserverapi");
  app.factory('userprofileService', ['$cookies' ,function($cookies){
    var userProfile;
    if (localStorage.getItem("loggedIn") !== null) {
      userProfile = {
        loggedIn: localStorage.getItem("loggedIn"),
        nickname: localStorage.getItem("nickname"),
        loginToken: localStorage.getItem("loginToken"),
      };
    }
    else if ($cookies.loggedIn == 'true') {
      userProfile = {
        loggedIn: $cookies.loggedIn = true,
        nickname: $cookies.nickname,
        loginToken: $cookies.loginToken,
      }
    }else{
      userProfile = {
        loggedIn: false,
        nickname: '',
        loginToken: '',
      };
    }
    function getUserprofile(){
      return userProfile;
    };
    function setUserprofile(nickname, loginToken){
      userProfile = {
        loggedIn: true,
        nickname: nickname,
        loginToken: loginToken,
      };
      $cookies.loggedIn = true;
      $cookies.nickname = nickname;
      $cookies.loginToken = loginToken;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("nickname", userProfile.nickname);
      localStorage.setItem("loginToken", loginToken);
    };
    function setUsernewLoginToken(loginToken){
      userProfile = {
        loggedIn: true,
        nickname: userProfile.nickname,
        loginToken: loginToken,
      };
      console.log(userProfile);
      $cookies.loggedIn = true;
      $cookies.nickname = userProfile.nickname,
      $cookies.loginToken = loginToken;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("nickname", userProfile.nickname);
      localStorage.setItem("loginToken", loginToken);
    }
    function clearUserprofile(){
      console.log('clearUserProfile called');
      userProfile = {
        loggedIn: false,
        nickname: '',
        loginToken: '',
      };
      $cookies.loggedIn = false;
      $cookies.nickname = '';
      $cookies.loginToken = '';
      localStorage.setItem("loggedIn", "false");
      localStorage.setItem("nickname", "");
      localStorage.setItem("loginToken", "");
      localStorage.clear();
      return userProfile;
    };

    return{
      getUserprofile: getUserprofile,
      setUserprofile: setUserprofile,
      setUsernewLoginToken: setUsernewLoginToken,
      clearUserprofile: clearUserprofile,
    };
  }]);
})();
