angular.module('services.socket', [])

.factory('Socket', [function() {
  var socket = {};

  socket.connect = function() {
    return io();
  };

  return socket;
}]);