angular.module('services.socket', [])

.factory('Socket', [function() {

  return io();

}]);