angular.module('services.user', [])

.factory('User', ['$http', '$state', '$window', function ($http, $state, $window) {

  var _currentUsername = $window.localStorage.getItem('com.kwiki.username');

  var current = function(newUsername) {
    if (newUsername !== undefined && typeof newUsername === 'string') {
      _currentUsername = newUsername;
      $window.localStorage.setItem('com.kwiki.username', _currentUser);
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
      $window.localStorage.setItem('com.kwiki', res.data);
      current(res.data.username);
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
