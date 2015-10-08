angular.module('services.user', [])

.factory('User', ['$http', '$state', '$window', function ($http, $state, $window) {

  var _currentUsername = $window.localStorage.getItem('com.kwiki.username');

  var current = function(newUsername) {
    if (newUsername !== undefined && typeof newUsername === 'string') {
      console.log('setting new current username');
      _currentUsername = newUsername;
      $window.localStorage.setItem('com.kwiki.username', _currentUsername);
    }
    return _currentUsername;
  };

  var add = function(userObject) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: userObject
    });
  };

  var logIn = function(userObject) {
    return $http({
      method: 'POST',
      url: '/login',
      data: userObject
    }).then(function(res) {
      console.log(res);
      $window.localStorage.setItem('com.kwiki', JSON.stringify(res.data));
      current(res.data.name);
    });

  };

  var logOut = function() {
    $http({
      method: 'POST',
      url: '/logout'
    }).then(function (res) {
      $window.localStorage.removeItem('com.kwiki');
      $state.transitionTo('login');
    })
    .catch(function (err) {
      console.log(err);
    });
  };

  var isAuth = function() {
    return $window.localStorage.getItem('com.kwiki');
  }

  return {
    current: current,
    add: add,
    logIn: logIn,
    logOut: logOut,
    isAuth: isAuth
  };
}]);
