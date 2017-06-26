(function() {
// Verify if already logged: if not, login:
  var already_logged_success = function (data){
    if (data && data.authResponse && data.authResponse.userID && data.authResponse.accessToken){
        var userID = data.authResponse.userID;
        var token = data.authResponse.accessToken;
        send_token(token,userID,email);
    }
    else{
        // Connection issue: login again
        call_login_fb();
    }
  }
  facebookConnectPlugin.getLoginStatus(already_logged_success, function (error){
    // User not logged: login now
    call_login_fb();
  });

  var fbLoginSuccess = function (userData){
    // userData: {"authResponse":{"userID":"1017897733282449","accessToken":"XXXXXXXXXXXXXXXXXXXXX","session_key":true,"expiresIn":"5183999","sig":"..."},"status":"connected"}
    var userID = userData.authResponse.userID;
    var token = userData.authResponse.accessToken;
    if (userID && token)
    {
      send_token(token,userID,email);
    }
    else
    {
      var err_string = "Facebook error";
      console.log(err_string);
      alert(err_string);
    }
  }

  function call_login_fb(){
    facebookConnectPlugin.login(["public_profile"],
      fbLoginSuccess,
      function (error) {
        var err_string = "Facebook error";
        console.log(err_string);
        alert(err_string);
      }
    );
  }
})();
