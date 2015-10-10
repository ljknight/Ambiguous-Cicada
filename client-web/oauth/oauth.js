/*global angular*/
angular.module('kwiki.oauth', [])
  .controller('OAuthController', ['$state', '$http', '$window', 'User', 'Socket', function($state, $http, $window, User, Socket) {
    $http({
      method: 'GET',
      url: '/auth/google/token'
    }).then(function(res) {
      console.log('OAuth token received: ', res.data);
      Socket.emit('googleLogin');
      $window.localStorage.setItem('com.kwiki', JSON.stringify(res.data));
      User.current(res.data);
      $state.transitionTo('finder');
    });
  }]);