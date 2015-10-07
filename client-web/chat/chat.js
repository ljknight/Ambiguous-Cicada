angular.module('kwiki.chat', ['services.socket', 'services.user'])
// .factory('ChatFactory', ['$http', '$rootScope', 'Socket', '$window', function ($http, $rootScope, Socket, $window) {

//   var chatFact = {};

//   chatFact.socket = Socket.connect('chat', $rootScope.user);

//   chatFact.loadChat = function(callback) {
//     this.socket.emit('loadChat', $rootScope.chatRoomId);
//     this.socket.on('message', function(message) {
//       callback(message);
//     });
//   };

//   chatFact.postMessage = function (message, callback) {
//     console.log(message);
//     this.socket.emit('message', message);
//   };

//   return chatFact;
// }])

.controller('ChatController', ['$scope', '$rootScope', 'Socket', 'User', function ($scope, $rootScope, Socket, User) {

  $scope.chatMessages = [];

  Socket.on('chatMessage', function(text) {
    console.log(text)
    $scope.chatMessages.unshift(message(text));
    $scope.$apply();
  });

  var message = function(text) {
    return "User "+User.current() + "msg: "+text.toString()+" "+(new Date()) 
  } 

  $scope.sendMessage = function () {
    if ( $scope.message.text.length ) {
      Socket.emit('sendMessage', $scope.message);
      $scope.chatMessages.unshift(message($scope.message));
      $scope.message.text = '';
    }
  };

  $scope.logOut = function () {
    User.logOut();
  };

}]);

