angular.module('kwiki', [
  'kwiki.finder',
  'kwiki.auth',
  'kwiki.chat',
  'services.socket',
  'services.user',
  'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  var checkAuth = function (success, failure) {
    failure = failure || '/login';
    return {
      check: function ($location, Users) {
        if(!!Users.isAuth()){
          // TODO ui-router refactor
          $location.path(success);
        } else {
          // TODO ui-router refactor
          $location.path(failure);
        }
      }
    };
  };

  $urlRouterProvider.otherwise('/login');

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
