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
    return {
      user:User.current(),
      text:text.toString(),
      humanTime:moment(new Date()).fromNow(),
      createdAt: new Date()
    } 
  } 

  setInterval(function(){
    for (var i = 0; i < $scope.chatMessages.length; i++) {
      console.log($scope.chatMessages[i].humanTime);
      $scope.chatMessages[i].humanTime = moment($scope.chatMessages[i].createdAt).fromNow()
    };
    $scope.$apply();
  },30*Math.pow(10,3))

  $scope.sendMessage = function () {
    if ( $scope.messageInput ) {
      Socket.emit('sendMessage', $scope.messageInput);
      $scope.chatMessages.unshift(message($scope.messageInput));
      $scope.messageInput = '';
    }
  };

  $scope.logOut = function () {
    User.logOut();
  };

}]);

