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
         humanTime: moment(msg.createdAt).fromNow()
       });
      };
      $scope.$apply();
    })

    Socket.on('chatMessage', function(msg) {
      $scope.chatMessages.unshift({
        user: msg.username,
        text: msg.text,
        humanTime: moment(msg.createdAt).fromNow()
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
        $scope.chatMessages.unshift({
          user: User.current(),
          text: $scope.messageInput,
          humanTime: moment(new Date()).fromNow()
        });
        $scope.messageInput = '';
      }
    };
  }
  ]);
