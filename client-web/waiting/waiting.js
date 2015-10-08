angular.module('kwiki.waiting', ['services.spinner', 'services.socket'])
  .controller('WaitingController', ['$scope', '$state', 'Spinner', 'Socket', 
    function($scope, $state, Spinner, Socket) {
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));
      $scope.cancel = function() {
        Socket.emit('cancelLucky');
        $state.transitionTo('finder');
      };
  }]);