angular.module('kwiki.auth', [])

.controller('AuthController', ['$scope', '$state', '$rootScope', '$window', 'User', 
  function ($scope, $rootScope, $state, $window, User) {
    $scope.user = {};

    $scope.signUp = function(userObject) {

      User.add(userObject)
      .then(function (res) {
        $scope.logIn(userObject);
      })
      .catch(function (err) {
        throw err;
      });
    };

    $scope.logIn = function(userObject) {
      User.logIn(userObject)
        .then(function(res) {
          $state.transitionTo('finder');
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    $scope.logOut = User.logOut;
}]);
