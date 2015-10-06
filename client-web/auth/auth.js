angular.module('kwiki.auth', [])

.factory('Users', function ($http, $location, $window) {
  var addUser = function (userObject) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: userObject
    });
  };

  var checkUser = function (userObject) {
    return $http({
      method: 'POST',
      url: '/login',
      data: userObject
    });
  };

  var logOut = function () {
    $http({
      method: 'POST',
      url: '/logout'
    }).then(function (res) {
      $window.localStorage.removeItem('com.kwiki');
      // TODO: ui-router refactor
      $location.path('/login');
    })
    .catch(function (err) {
      console.log(err);
    });
  };

  var isAuth = function () {
    return $window.localStorage.getItem('com.kwiki');
  }

  return {
    addUser: addUser,
    checkUser: checkUser,
    logOut: logOut,
    isAuth: isAuth
  };
})

.controller('UserController', function ($scope, $rootScope, $location, $window, Users) {
  $scope.addUser = function (username, password) {
    var userObject = {
      username: username,
      password: password
    };
    Users.addUser(userObject)
    .then(function (res) {
      // Does checkUser need to be on scope?
      $scope.checkUser(username, password);
    })
    .catch(function (err) {
      throw err;
    });
  };
  // Does checkUser need to be on scope?
  $scope.checkUser = function (username, password) {
    var userObject = {
      username: username,
      password: password
    };

    Users.checkUser(userObject).then(function (res) {
      // Does res.data need to be stringified, or is it JSON already?
      $window.localStorage.setItem('com.kwiki', JSON.stringify(res.data));
      $rootScope.user = res.data;
      // TODO: ui-router refactor
      $location.path('/loading');
    });
  };


  $scope.logOut = function () {
    Users.logOut();
  };
});



























