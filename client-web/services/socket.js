/*global angular, io*/
angular.module('services.socket', [])

.factory('Socket', [function() {

  var socket = io();

  socket.on('error', function(data) {
    console.err(data.err);
  });

  return socket;

}]);
