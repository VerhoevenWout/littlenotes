 (function() {
  'use strict';

  var app = angular.module("dataserverapi");
  app.service('functions', ['$timeout', '$interval', '$cookies','$location','loginService', 'userprofileService', 'bottlesService' ,function($timeout, $interval, $cookies, $location, loginService, userprofileService, bottlesService){
    // ====================================================================================
    // VARS'
    var userprofile,loginToken,lat,lng,shakeEvent, bgLocationServices, loginTokenToGetBottles, getSpecificBottlesInterval;
    $cookies.debug = "";
    // ====================================================================================
    // INIT SETVIEW WORKS
    function setView(view){
      $('input, textarea').blur();
      userprofile = userprofileService.getUserprofile();
      console.log(userprofile);
      if (view != '/') {
        $('#top-navigation').removeClass('nav-top-hide');
      } else{
        $('#top-navigation').addClass('nav-top-hide');
      }
      if (userprofile.loggedIn){
        $location.path(view);
      }else{
        $location.path('/');
      }
    }
    // ====================================================================================
    // CHANGE TO INTRODUCTION
    function changeToIntroduction(nickname, loginToken){
      hideOverlay();
      setView('introduction');
      $timeout(function(){
        $('.introductionpage .bottle').addClass('bottle-reveal');
        $('.introductionpage .header').addClass('header-reveal');
      },500);
      $timeout(function(){
        $('.introduction-continue-button').addClass('introduction-continue-button-reveal');
      }, 1500);
    }
    // ====================================================================================
    // CHANGE TO LOGIN
    function changeTologgedin(){
      setView('search');
      $timeout(function(){
        $('#top-navigation').removeClass('nav-top-hide');
      }, 300);
      var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");
      if (!isChromium) {
        startGeolocation();
      }
      console.log('changeTologgedin');
      loginTokenToGetBottles = userprofile.loginToken;
      startGetSpecificBottlesInterval();
      hideOverlay();
    }
    function startGetSpecificBottlesInterval(){
      // START SEARCH
      getSpecificBottlesInterval = $interval(function(){
        loginTokenToGetBottles = userprofile.loginToken;
        getSpecificBottles(loginTokenToGetBottles, roundLat, roundLng);
      }, 5000);
    }
    // ====================================================================================
    // CHANGE TO LOGOUT
    function changeTologgedout(){
      // clearInterval(getSpecificBottlesInterval);
      $interval.cancel(getSpecificBottlesInterval);
      if (bgLocationServices) {
        bgLocationServices.stop();
      }
      userprofileService.clearUserprofile();
      setView('/');
      toggleMobileMenu();
    }
    // ====================================================================================
    // FORGOT PASSWORD
    function forgotPassword(email){
    loginService.forgotPassord(email).then(function(data){
      console.log(data);
      $('.forgot-overlay').removeClass('hide-loading-overlay');
      $timeout(function(){
        $('.forgot-overlay').removeClass('fade-loading-overlay');
        $('.send-overlay-header').addClass('reveal-send-overlay-text');
        $('.send-overlay-paragraph').addClass('reveal-send-overlay-text');
      },300);
      $timeout(function(){
        setView('/');
        $('.forgot-overlay').addClass('fade-loading-overlay');
      },4300);
      $timeout(function(){
        $('.forgot-overlay').addClass('hide-loading-overlay');
        setView('/');
      },4600);

      }, function(data){
        console.log(data);
      });
    }
    // ====================================================================================
    // CHANGE TO FOUND BOTTLE
    function changeToFoundBottle(bottleText, creator){
      // clearInterval(getSpecificBottlesInterval);
      $interval.cancel(getSpecificBottlesInterval);
      setView('bottle');
      showFoundOverlay();
      showFoundOverlayAnimation();

      $('input, textarea').blur();
      console.log(bottleText);
      $cookies.bottleText = bottleText;
      $cookies.creator = creator;
      $timeout(function(){
        $('.bottlepage .bottle').addClass('bottle-reveal');
        $('.introduction-continue-button').click(function(){
          showOverlay();
          $timeout(function(){
            changeTologgedin(nickname, loginToken);
          }, 500);
        });
      },2000);
      $timeout(function(){
        $('.go-back-button').addClass('go-back-button-reveal');
      }, 1000);
    }
    // ====================================================================================
    // REFRESH LOGIN TOKEN
    function refreshLoginToken(){
    var loginToken = $cookies.loginToken;
    loginService.refreshLoginToken(loginToken).then(function(data){
      var loginToken = data.data.token;
      userprofileService.setUsernewLoginToken(loginToken);
      }, function (data){
      console.log(data);
      });
    }
    // ====================================================================================
    // WRITE BOTTLE ANIMATIONS
    function writeBottleAnimation(){
      $cookies.bottleNoteError = '';
      // clearInterval(getSpecificBottlesInterval);
      $interval.cancel(getSpecificBottlesInterval);

      $('.searchpage .shake-instruction').removeClass('shake-instruction-reveal');
      $('.searchpage .pulse').addClass('pulse-disable');
      $('.searchpage .greeting').addClass('pulse-disable');
      $('.searchpage .write-button').addClass('pulse-disable');
      $('.searchpage .bottle-note').addClass('bottle-note-reveal');
      $timeout(function(){
      $('.searchpage .shake-instruction').addClass('shake-instruction-reveal');
      $('.searchpage .header').addClass('header-reveal');
      $('.searchpage .bottle-note-error').addClass('header-reveal');
      },500);
      limitTextarea();
      initShake();
      $('.searchpage .header').click(function(){
        hideBottleAnimation();
      });
      $('.bottle-note-text').on('input', function(){
        if ($(this).val() == '') {
          // $('.drop-button-pulse').removeClass('drop-button-pulse-reveal');
          $('.searchpage .shake-instruction').removeClass('shake-instruction-reveal');
        } else{
          // $('.drop-button-pulse').addClass('drop-button-pulse-reveal');
          $('.searchpage .shake-instruction').addClass('shake-instruction-reveal');
        }
      });
    }
    function hideBottleAnimation(){
    $('.bottle-note-text').blur();
    stopShake();
    // $('.searchpage .drop-button-pulse').removeClass('drop-button-pulse-reveal');
    // $('.searchpage .drop-button').removeClass('drop-button-reveal');
    $('.searchpage .shake-instruction').removeClass('shake-instruction-reveal');
    $('.searchpage .header').removeClass('header-reveal');
    $('.searchpage .bottle-note-error').removeClass('header-reveal');
    enableSearch();
    }
    function enableSearch(){
    $('.searchpage .pulse').removeClass('pulse-disable');
    $('.searchpage .greeting').removeClass('pulse-disable');
    $('.searchpage .write-button').removeClass('pulse-disable');
    $('.searchpage .bottle-note').removeClass('bottle-note-reveal');
    startGetSpecificBottlesInterval();
    }
    function toggleMobileMenu(){
    $('.hamburger').toggleClass('is-active');
    $('.hamburger').toggleClass('hamburger-inverse-color');
    $('.nav-top').toggleClass('nav-top-expanded');
    }
    // ====================================================================================
    // VALIDATIONS
    function limitTextarea(){
      var lines = 8;
      var newLines = 0;
      $('.bottle-note-text').keydown(function(e) {
        newLines = $(this).val().split("\n").length;
        if(e.keyCode == 13 && newLines >= lines) {
        return false;
        }
      });
    };
    function isValidEmailAddress(emailAddress) {
      var pattern = new RegExp(/\S+@\S+\.\S+/);
      return pattern.test(emailAddress);
    };
    // ====================================================================================
    // PHONEGAP UTILITIES
    function initShake(){
      shakeEvent = new Shake({threshold: 15});
      shakeEvent.start();
      window.addEventListener('shake', function(event){
      event.preventDefault();
      vibrateFunction();
      hideBottleAnimation();
      //        sendBottle();
      if ($('.bottle-note-text').val() != ''){
      sendBottle();
      } else{
      $debug.error = 'write a message';
      }
      }, false);
      if(!("ondevicemotion" in window)){
        console.log("Not Supported");
      }
    }
    function stopShake(){
      shakeEvent.stop();
    }
    function vibrateFunction(){
      navigator.vibrate(100);
    }
    // ====================================================================================
    // LOADING OVERLAY
    function showOverlay(){
      $('.loading-overlay').removeClass('hide-loading-overlay');
      $('.loading-overlay').removeClass('fade-loading-overlay');
    }
    function hideOverlay(){
      console.log('hiding');
      $('.loading-overlay').addClass('fade-loading-overlay');
      $timeout(function(){
      $('.loading-overlay').addClass('hide-loading-overlay');
      },300);
    }
    $timeout(function(){
      hideOverlay();
      $('.loading-overlay-black').addClass('fade-loading-overlay ');
      $timeout(function(){
        $('.loading-overlay-black').addClass('hide-loading-overlay');
      },300);
    },1500);
    // ====================================================================================
    // SEND/FOUND BOTTLE OVERLAYS
    function showSendOverlay(){
      $('.send-overlay').removeClass('hide-loading-overlay');
      $('.send-overlay').removeClass('fade-loading-overlay');
    }
    function showSendOverlayAnimation(){
      $timeout(function(){
        $('.send-overlay #cirkel').attr('class','cirkel-animation');
        $('.send-overlay #check').attr('class','st2 check-animation');
        $('.send-overlay #stars').attr('class','stars-animation');
      }, 1000);
      $timeout(function(){
        $('.send-overlay-header').addClass('reveal-send-overlay-text');
      }, 2000);
      $timeout(function(){
        $('.send-overlay-paragraph').addClass('reveal-send-overlay-text');
      }, 3000);
      $timeout(function(){
        hideOverlayAnimation();
      }, 6000);
    }
    function showFoundOverlay(){
      $('.found-overlay').removeClass('hide-loading-overlay');
      $('.found-overlay').removeClass('fade-loading-overlay');
    }
    function showFoundOverlayAnimation(){
      $timeout(function(){
        $('.found-overlay #cirkel').attr('class','cirkel-animation');
        $('.found-overlay .mark').attr('class','st5 mark-animation');
        $('.found-overlay #stars').attr('class','stars-animation');
      }, 1000);
      $timeout(function(){
        $('.found-overlay-header').addClass('reveal-found-overlay-text');
      }, 2000);
      $timeout(function(){
        hideFoundOverlayAnimation();
      }, 4000);
    }
    function hideOverlayAnimation(){
      $('.send-overlay').addClass('fade-loading-overlay');
      $timeout(function(){
      $('.send-overlay').addClass('hide-loading-overlay');
      $('#cirkel').attr('class','cirkel');
      $('#check').attr('class','st2 check');
      $('#stars').attr('class','stars');
      $('.send-overlay-header').removeClass('reveal-send-overlay-text');
      $('.send-overlay-paragraph').removeClass('reveal-send-overlay-text');
      },300);
    }
    function hideFoundOverlayAnimation(){
      $('.found-overlay').addClass('fade-loading-overlay');
      $timeout(function(){
        $('.found-overlay').addClass('hide-loading-overlay');
        $('.found-overlay #cirkel').attr('class','cirkel');
        $('.found-overlay #check').attr('class','st2 check');
        $('.found-overlay #stars').attr('class','stars');
        $('.found-overlay-header').removeClass('reveal-send-overlay-text');
      },300);
    }
    function showSendOverlayError(){
      $('.send-overlay-error').removeClass('hide-loading-overlay');
      $('.send-overlay-error').removeClass('fade-loading-overlay');
      $timeout(function(){
        $('.send-overlay-error').addClass('hide-loading-overlay');
        $('.send-overlay-error').addClass('fade-loading-overlay');
      },4000);
    }
    // ====================================================================================
    // LIMIT BOTTLE-TEXT ROWS
    $('input').onkeypress = function(event){
      event.preventDefault();
      var nationUnicode=event.which;
      var utf8=encodeURIComponent(String.fromCharCode(parseInt(nationUnicode, 10)));
      if  (utf8.search("%EF") != 0) //value is not an Emoji
        $('input').value= $('input').value + String.fromCharCode(nationUnicode);
      }
      $('input').onkeydown = function (event){
      if (event.keyCode == 8){
        event.preventDefault();
        var txtval = $('input').value;
        $('input').value = txtval.slice(0, - 1);
      }
    }
    // ====================================================================================
    // SEND BOTTLE
    function sendBottle(){
      vibrateFunction();
      $cookies.bottleNoteError = "";
      showOverlay();
      $('.drop-button-pulse').removeClass('drop-button-pulse-start-animation');
      var nickname = userprofile.nickname;
      var loginToken = userprofile.loginToken;
      var message = $('.bottle-note-text').val();
      // GET LAT/LNG
      var geolocationOnSuccess = function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        bottlesService.createBottle(nickname, loginToken, message, lat, lng).then(function(data){
        hideOverlay();
        showSendOverlay();
        console.log(data);
        hideBottleAnimation();
        $('.bottle-note-text').val('');
          $timeout(function(){
            showSendOverlayAnimation();
            startGetSpecificBottlesInterval();
          },300);
        }, function (data){
        hideOverlay();
        startGetSpecificBottlesInterval();
        console.log(data);
        writeBottleAnimation();
        $cookies.bottleNoteError = "Sorry, that note is not allowed";
        });
        hideOverlay();
      };
      var geolocationOnError = function(error){
      console.log(error);
      hideOverlay();
      showSendOverlayError();
      // $scope.debug ='code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
      }
      navigator.geolocation.getCurrentPosition(geolocationOnSuccess, geolocationOnError, {timeout:2000, enableHighAccuracy: true});
    }

    // ====================================================================================
    // GET BACKGROUND LOCATION ()
    // This function is called every locationupdate (foreground and background)
    var roundLat;
    var roundLng;
    function startGeolocation(){
      //Make sure to get at least one GPS coordinate in the foreground before starting background services
      var geolocationInterval = setInterval(function(){
        navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        roundLat = lat.toFixed(4);
        roundLng = lng.toFixed(4);
        // console.log(roundLat + ' / ' + roundLng);
        }, function(error) {
        console.error(error);
        });
      }, 1000);

    // // GEOLOCATION BACKGROUND
    //  bgLocationServices =  window.plugins.backgroundLocationServices;
    //  bgLocationServices.configure({
    //   desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
    //   distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
    //   debug: false, // <-- Enable to show visual indications when you receive a background location update
    //   interval: 5000, // (Milliseconds) Requested Interval in between location updates.
    //   useActivityDetection: true, // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)
    //  });
    //  bgLocationServices.registerForLocationUpdates(function(location) {
    //    var lat = location.latitude;
    //    var lng = location.longitude;
    //    roundLat = lat.toFixed(4);
    //    roundLng = lng.toFixed(4);
    //    // alert(roundLat + '/' + roundLng);
    //  }, function(err) {
    //    alert("Error: Didnt get an update", err);
    //  });
    //  //Start the Background Tracker. When you enter the background tracking will start, and stop when you enter the foreground.
    //  bgLocationServices.start();
    }

    // This function is called every 5s
    function getSpecificBottles(loginTokenToGetBottles, roundLat, roundLng){
      console.log('called');
      bottlesService.getSpecificBottles(loginTokenToGetBottles, roundLat, roundLng).then(function(data){
        console.log(data);
        var gotMessage = data.data.bottles;
        if (gotMessage != undefined) {
          var bottleText = data.data.bottles.message;
          var creator = data.data.bottles.nickname;
          changeToFoundBottle(bottleText, creator);
        }
      }, function(data){
      console.log(data);
      // alert(JSON.stringify(data));
      });
    }

    return{
    setView: setView,
    changeTologgedin: changeTologgedin,
    changeTologgedout: changeTologgedout,
    forgotPassword: forgotPassword,
    changeToIntroduction: changeToIntroduction,
    refreshLoginToken: refreshLoginToken,

    hideBottleAnimation: hideBottleAnimation,
    showOverlay: showOverlay,
    hideOverlay: hideOverlay,
    showSendOverlay: showSendOverlay,
    showSendOverlayAnimation: showSendOverlayAnimation,
    hideOverlayAnimation: hideOverlayAnimation,
    enableSearch: enableSearch,
    writeBottleAnimation: writeBottleAnimation,
    toggleMobileMenu: toggleMobileMenu,
    limitTextarea: limitTextarea,
    initShake: initShake,
    stopShake: stopShake,
    vibrateFunction: vibrateFunction,
    sendBottle: sendBottle,
    isValidEmailAddress: isValidEmailAddress,
    };
    }]);
  })();
