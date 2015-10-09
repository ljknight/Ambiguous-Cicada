angular.module('kwiki.auth', ['services.user'])

.controller('AuthController', ['$scope', '$state', '$window', 'User', 'Spinner',
  function ($scope, $state, $window, User, Spinner) {
    $scope.user = {};


    $scope.signUp = function(userObject) {
      //Creates and starts spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));

      User.add(userObject)
      .then(function (res) {
        //stops spinner
        spinner.stop();
        $scope.logIn(userObject);
      })
      .catch(function (error) {
        //stops spinner
        spinner.stop();
        console.error(error);
        $scope.error = error.data;
        
      });
    };

    $scope.logIn = function(userObject) {
      //Creates and starts spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));

      User.logIn(userObject)
        .then(function(res) {
          //stops spinner
          spinner.stop();
          $state.transitionTo('finder');
        })
        .catch(function(error) {
          //stops spinner
          spinner.stop();
          console.error(error);
          $scope.error = error.data;
        });
    };

    $scope.logOut = function() {
      User.logOut()
        .then(function() {
          $state.transitionTo('login');
        });
    };
}]);
