(function() {
  'use strict';

  var app = angular.module("dataserverapi");
  app.factory('bottlesService', function($http){
    // ====================================================================================
    // GET SPECIFIC BOTTLES
    function getSpecificBottles(loginToken, lat, lng){
      return $http({
        method: 'GET',
        url: 'http://woutverhoeven.webhosting.be/api/bottle',
        params: {
          token: loginToken,
          lat: lat,
          lng: lng,
        }
      });
    }
    // ====================================================================================
    // CREATE BOTTLE
    function createBottle(nickname, loginToken, message, lat, lng){
      var roundLat = lat.toFixed(4);
      var roundLng = lng.toFixed(4);
      return $http({
        method: 'POST',
        url: 'http://woutverhoeven.webhosting.be/api/bottle/store',
        params: {
          nickname: nickname,
          token: loginToken,
          message: message,
          lat: roundLat,
          lng: roundLng,
          public: true,
        }
      });
    }

    return{
      getSpecificBottles: getSpecificBottles,
      createBottle: createBottle,
    };
  });
})();
