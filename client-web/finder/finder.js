angular.module('kwiki.finder', ['services.socket', 'services.user'])

.controller('FinderController', ['$scope', 'Socket', 'User', function ($scope, Socket, User) {
  $scope.disableButton = false;

  $scope.address = '';

  $scope.submit = function () {
    // TODO: button gets stuck disabled
    $scope.disableButton = true;
    Socket.emit('joinRoom', {username: User.current(), address: $scope.address});
    // TODO: state transition
  };

  $scope.logOut = function () {
    User.logOut();
  };
}]);
