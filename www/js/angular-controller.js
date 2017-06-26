(function() {
  'use strict';
  // cd Documents/projects/web-projects/local/phonegap/phonegap-bachelorproof/bottled/

  var app = angular.module("mainApp", ['ngCookies', 'ngRoute', 'ngAnimate', 'dataserverapi']);
  app.controller('MainController', ['$cookies','$scope', '$timeout', '$http', '$location', 'loginService', 'userprofileService', 'bottlesService', 'functions', function($cookies, $scope, $timeout, $http, $location, loginService, userprofileService, bottlesService, functions) {
    // ====================================================================================
    // VARS
    $scope.loginerror = '';
    $cookies.bottleNoteError = '';
    var userprofile = userprofileService.getUserprofile();
    if (userprofile.loggedIn){
      functions.changeTologgedin(userprofile.nickname, userprofile.loginToken);
      $scope.nickname = userprofile.nickname;
    }else{
      functions.changeTologgedout();
      $scope.nickname = '';
    }
    // ====================================================================================
    // SCOPE FUNCTIONS
    // EMAIL SUBMIT SIGNUP WORKS
    $scope.submitSignup = function(){
      $scope.loginerror = '';
      $cookies.bottleNoteError = '';
      functions.showOverlay();
      var nickname  = this.nickname;
      var email     = this.email;
      var password  = this.password;
      console.log('submit');

      if ( (nickname == undefined) || (email == undefined) || (password == undefined) ){
        functions.hideOverlay();
        $scope.loginerror = 'Please check all the fields';
        console.log('?');
      } else{
        if (password.length <= 5) {
          console.log('no');
          functions.hideOverlay();
          $scope.loginerror = 'Password min 6 characters';
        } else{
          if (functions.isValidEmailAddress(email)){
            loginService.signupUser(nickname, email, password).then(function(data){
              loginService.loginUser(email, password).then(function(data){
                var nickname = data.data.nickname;
                var loginToken = data.data.token;
                $scope.nickname = nickname;
                userprofileService.setUserprofile(nickname, loginToken);
                // start introduction
                functions.changeToIntroduction();
                // updateScopeCurrentPath();
              });
            }, function (data){
              console.log(data);
              functions.hideOverlay();
              $scope.loginerror = 'Email already taken';
            });
          } else{
            functions.hideOverlay();
            $scope.loginerror = 'This is not an email';
          }
        }
      }
    }
    $scope.submitIntroductionContinue = function(){
      functions.changeTologgedin();
    }
    // ====================================================================================
    // EMAIL SUBMIT LOGIN WORKS
    $scope.submitLogin = function(){
                                    console.log('submit');
      $scope.loginerror = '';
      $cookies.bottleNoteError = '';
      functions.showOverlay();
      var email     = this.email;
      var password  = this.password;
      if ( (email == undefined) || (password == undefined) ){
        functions.hideOverlay();
        $scope.loginerror = 'Please check all the fields';
      } else{
        if (functions.isValidEmailAddress(email)){
          loginService.loginUser(email, password).then(function(data){
            var nickname = data.data.nickname;
            var loginToken = data.data.token;
            $scope.nickname = nickname;
            userprofileService.setUserprofile(nickname, loginToken);

            functions.changeTologgedin();
            // updateScopeCurrentPath();

          }, function (data){
            console.log(data);
            functions.hideOverlay();
            $scope.loginerror = 'Email / Password wrong';
          });
        } else{
          $scope.loginerror = 'This is not an email';
        }
      }
      functions.hideOverlay();
    }
    $scope.changeTologgedin = function(){
      functions.changeTologgedin();
    }
    // ====================================================================================
    // EMAIL SUBMIT LOGOUT WORKS
    $scope.submitLogout = function() {
      $scope.loginerror = '';
      $cookies.bottleNoteError = '';
      $cookies.bottleText = "Oh, you didn't find any notes yet.\n\nGo ahead, start dropping some notes for others to find and start discovering stories all over the world.";
      functions.changeTologgedout();
      $scope.nickname = null;
      $scope.email = null;
      $scope.password = null;
    };
    // ====================================================================================
    // EMAIL SUBMIT FORGOT WORKS
    $scope.submitForgot = function() {
      $scope.loginerror = '';
      $cookies.bottleNoteError = '';
      var email = this.email;
      functions.forgotPassword(email);
      // updateScopeCurrentPath();
    };
    // ====================================================================================
    // DROP SUBMIT WORKS
    // $('.drop-button').click(function(){
    //                         console.log('sadf');
    //                         $cookies.bottleNoteError = '';
    //                         functions.vibrateFunction();
    //                         functions.hideBottleAnimation();
    //                         if ($('.bottle-note-text').val() != ''){functions.sendBottle();
    //                         } else{$debug.error = 'write a message';}
    // });
    // $scope.submitDrop = function() {
    //   $cookies.bottleNoteError = '';
    //   functions.vibrateFunction();
    //   functions.hideBottleAnimation();
    //   if ($('.bottle-note-text').val() != ''){functions.sendBottle();
    //   } else{$debug.error = 'write a message';}
    // };
    // ====================================================================================
    // EXTRA SCOPE FUNCTIONS
    $scope.goBack = function() {
      $scope.loginerror = '';
      window.history.back();
    };
    $scope.changeView = function(view) {
      $scope.loginerror = '';
      $location.path(view);
    };
    $scope.vibrate = function(){
      navigator.vibrate(1000);
    }
    $scope.writeBottleAnimation = function(){
      functions.writeBottleAnimation();
    }
    $scope.limitTextarea = function(textarea, maxLines, maxChar) {
      functions.limitTextarea();
    }
    // ====================================================================================
    // EXTRA FUNCTIONS
    // function updateScopeCurrentPath(){
    //   $scope.currentPath = $location.path();
    // }
    $cookies.bottleText = "Oh, you didn't find any notes yet.\n\nGo ahead, start dropping some notes for others to find and start discovering stories all over the world.";
    $cookies.creator = 'Little Notes';
    $scope.$watch(function() { return $cookies.bottleText; }, function(newVal, oldVal) {
      $scope.bottleText = $cookies.bottleText;
    });
    $scope.$watch(function() { return $cookies.creator; }, function(newVal, oldVal) {
      $scope.creator = $cookies.creator;
    });
    $scope.$watch(function() { return $cookies.bottleNoteError; }, function(newVal, oldVal) {
      $scope.bottleNoteError = $cookies.bottleNoteError;
    });
    $scope.$watch(function() { return $cookies.debug; }, function(newVal, oldVal) {
      $scope.debug = $cookies.debug;
    });
    $scope.$watch(function() { return $cookies.debug2; }, function(newVal, oldVal) {
      $scope.debug2 = $cookies.debug2;
    });
  }]);
  // ====================================================================================
  // ROUTES CONTROLLER WORKS
  app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
          templateUrl : 'views/login.html',
      })
      .when('/register', {
          templateUrl : 'views/register.html',
      })
      .when('/forgot', {
          templateUrl : 'views/forgot.html',
      })
      .when('/introduction', {
          templateUrl : 'views/introduction.html',
      })
      .when('/search', {
          templateUrl : 'views/search.html',
      })
      .when('/bottle', {
          templateUrl : 'views/bottle.html',
      })
      .otherwise({
          redirectTo : '/',
      });
  }]);
  app.config(['$httpProvider', function($httpProvider){
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};
    }
  ]);
})();
