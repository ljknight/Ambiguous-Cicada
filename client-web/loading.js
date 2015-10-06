angular.module('kwiki.load', [])

.factory('LoadFactory', ['$location', 'SocketFactory', '$window', '$rootScope', function ($location, SocketFactory, $window, $rootScope) {
  var loadFact = {};

  loadFact.socket = SocketFactory.connect('match');

  loadFact.postMatch = function () {
    console.log('postMatch gets called')
    this.socket.emit('matching', $rootScope.user);
    this.socket.on('matched', function (data) {
      $rootScope.chatRoomId = data;
      $rootScope.$apply(function () {
        // TODO: ui-router refactor
        $location.path('/chat');
      });
    });
  };
  
  return loadFact;
}])

.controller('LoadController', ['$scope', 'LoadFactory', 'Users', function ($scope, LoadFactory, Users) {
  $scope.disableButton = false;

  $scope.submit = function () {
    // TODO: button gets stuck disabled
    $scope.disableButton = true;
    LoadFactory.postMatch();
  };

  $scope.logOut = function () {
    Users.logOut();
  };
}]);
