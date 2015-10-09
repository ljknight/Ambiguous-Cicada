angular.module('kwiki.chat', ['services.socket', 'services.user'])

.controller('ChatController', ['$scope', '$q', 'Socket', 'User',
  function($scope, $q, Socket, User) {

    $scope.chatMessages = [];
    $scope.user = User.current();

    Socket.on('populateChat', function(data) {
      var messages = data.messages;
      var placeName = data.placeName;
      $scope.roomname = placeName;
      for (var i = 0; i < messages.length; i++) {
        var msg = messages[i];
        $scope.chatMessages.push({
          user: msg.username,
          text: msg.text,
          timestamp: msg.timestamp,
          humanTime: moment(msg.timestamp).fromNow()
        });
      }
      $scope.$apply();
      // Async - must load chats before scrolling to top
      scrollToTop();
    });

    Socket.on('chatMessage', function(msg) {
      $scope.chatMessages.push({
        user: msg.username,
        text: msg.text,
        timestamp: new Date(),
        humanTime: moment(new Date()).fromNow()
      });
      $scope.$apply();
    });

    // Update time every 30 sec  
    setInterval(function() {
      for (var i = 0; i < $scope.chatMessages.length; i++) {
        console.log($scope.chatMessages[i].humanTime);
        $scope.chatMessages[i].humanTime = moment($scope.chatMessages[i].createdAt).fromNow();
      }
      $scope.$apply();
      scrollToTop();
    }, 30 * Math.pow(10, 3));



    $scope.sendMessage = function() {
      console.log('current User: ', User.current());
      if ($scope.messageInput) {
        Socket.emit('sendMessage', $scope.messageInput);
        $scope.chatMessages.push({
          user: User.current(),
          text: $scope.messageInput,
          timestamp: new Date(),
          humanTime: moment(new Date()).fromNow()
        });
        $scope.messageInput = '';
      }
    };

    var scrollToTop = function() {
      var messagesContainer = document.getElementsByClassName('messages-container')[0];
      messagesContainer.scrollTop = messagesContainer.scrollHeight;      
    };
  }
]);
