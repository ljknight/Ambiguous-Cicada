angular.module('kwiki.finder', ['services.socket', 'services.user'])

.controller('FinderController', ['$scope', 'Socket', 'User', function ($scope, Socket, User) {
  $scope.disableButton = false;

  var address = '';

  $scope.submit = function () {
    // TODO: button gets stuck disabled
    $scope.disableButton = true;
    Socket.emit('joinRoom', {username: User.current(), address: address});
  };

  $scope.logOut = function () {
    User.logOut();
  };
}]);
