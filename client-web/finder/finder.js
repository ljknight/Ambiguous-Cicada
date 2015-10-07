angular.module('kwiki.finder', ['services.socket', 'services.user'])

.controller('FinderController', ['$scope', '$state', 'Socket', 'User', function ($scope, $state, Socket, User) {
  $scope.disableButton = false;

  $scope.address = '';

  $scope.submit = function () {
    // TODO: button gets stuck disabled
    $scope.disableButton = true;
    Socket.emit('joinRoom', {username: User.current(), address: $scope.address});
    // TODO: state transition
    $state.transitionTo('chat');
  };

  $scope.logOut = function () {
    User.logOut();
  };
}]);
