/*global angular*/
angular.module('kwiki.oauth', [])
  .controller('OAuthController', ['$state', '$http', '$window', 'User', function($state, $http, $window, User) {
    $http({
      method: 'GET',
      url: '/auth/google/token'
    }).then(function(res) {
      console.log('OAuth token received: ', res.data);
      $window.localStorage.setItem('com.kwiki', JSON.stringify(res.data));
      User.current(res.data.name);
      $state.transitionTo('finder');
    });
  }]);