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

  Socket.on('chatMessage', function(chatMessage) {
    $scope.chatMessages.unshift(chatMessage);
    $scope.$apply();
  });

  $scope.message = {
    username: User.current(),
    text: '',
    createdAt: new Date()
  };

  $scope.sendMessage = function () {
    if ( $scope.message.text.length ) {
      Socket.emit('sendMessage', $scope.message);
      $scope.chatMessages.unshift({
        username: this.message.userName,
        text: this.message.text,
        createdAt: moment(this.createdAt).fromNow()
      });

      $scope.message.text = '';
    }
  };

  $scope.logOut = function () {
    User.logOut();
  };

}]);

