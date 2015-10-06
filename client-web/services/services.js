angular.module('services', [])
  .factory('Socket', ['$state', function ($state) {
    var socket = {};

    // LEGACY TODO: the bugfix applied in socket-client/url.js:37 might remove the need for this
    //hacky way to make this work in developer environments at specified port number
    socket.host = $location.host() !== "localhost" ? $location.host() : "localhost:3000";

    socket.connect = function (nameSpace) {
      return io.connect(nameSpace);
    };

    return socket;
  }]);