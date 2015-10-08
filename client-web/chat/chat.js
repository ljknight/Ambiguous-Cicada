angular.module('kwiki.chat', ['services.socket', 'services.user'])

.controller('ChatController', ['$scope', 'Socket', 'User',
  function($scope, Socket, User) {

    $scope.chatMessages = [];

    Socket.on('chatMessage', function(text) {
      console.log(text);
      $scope.chatMessages.unshift(message(text));
      $scope.$apply();
    });

    var message = function(text) {
      return {
        user: User.current(),
        text: text.toString(),
        humanTime: moment(new Date()).fromNow(),
        createdAt: new Date()
      };
    };

    setInterval(function() {
      for (var i = 0; i < $scope.chatMessages.length; i++) {
        console.log($scope.chatMessages[i].humanTime);
        $scope.chatMessages[i].humanTime = moment($scope.chatMessages[i].createdAt).fromNow();
      }
      $scope.$apply();
    }, 30 * Math.pow(10, 3));

    $scope.sendMessage = function() {
      if ($scope.messageInput) {
        Socket.emit('sendMessage', $scope.messageInput);
        $scope.chatMessages.unshift(message($scope.messageInput));
        $scope.messageInput = '';
      }
    };

  }
]);
