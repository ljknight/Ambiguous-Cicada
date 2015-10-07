angular.module('kwiki', [
  'kwiki.load',
  'kwiki.auth',
  'kwiki.chat',
  'ui-router'
])

.config(['$stateProvider', '$urlRouteProvider', function ($stateProvider, $urlRouteProvider) {

  var checkAuth = function (success, failure) {
    failure = failure || '/login';
    return {
      check: function ($location, Users) {
        if(!!Users.isAuth()){
          $location.path(success);
        } else {
          $location.path(failure);
        }
      }
    };
  };

  $urlRouteProvider.otherwise('/');

  $stateProvider
    .state('login', {
      templateUrl: 'auth/login.html',
      controller: 'AuthController',
      url: '/login'
    })
    .state('signup', {
      templateUrl: 'auth/signup.html',
      controller: 'AuthController',
      url: '/signup'
    })
    .state('finder', {
      templateUrl: 'finder/finder.html',
      controller: 'FinderController',
      url: '/finder'
    })
    .state('chat', {
      templateUrl: 'chat/chat.html',
      controller: 'ChatController'
    });

}]);
