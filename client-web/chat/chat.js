angular.module('kwiki.chat', ['services.socket', 'services.user'])

.controller('ChatController', ['$scope', 'Socket', 'User',
  function($scope, Socket, User) {

    $scope.chatMessages = [];

    Socket.on('populateChat',function(messages){
      console.log('sending: ',messages)
      for (var i = 0; i < messages.length; i++) {
        var msg = messages[i];
        $scope.chatMessages.push({
         user: msg.username,
         text: msg.text,
         timestamp: msg.timestamp,
         humanTime: moment(msg.timestamp).fromNow()
       });
      };
      $scope.$apply();
    })

    Socket.on('chatMessage', function(msg) {
      $scope.chatMessages.push({
        user: msg.username,
        text: msg.text,
        timestamp: new Date(),
        humanTime: moment(new Date()).fromNow()
      });
      $scope.$apply();
    });

    setInterval(function() {
      for (var i = 0; i < $scope.chatMessages.length; i++) {
        console.log($scope.chatMessages[i].humanTime);
        $scope.chatMessages[i].humanTime = moment($scope.chatMessages[i].createdAt).fromNow();
      }
      $scope.$apply();
    }, 30 * Math.pow(10, 3));

    $scope.sendMessage = function() {
      console.log('current User: ',User.current())
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
  }
  ]);
