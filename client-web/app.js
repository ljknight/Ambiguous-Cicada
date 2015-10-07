angular.module('kwiki', [
  'kwiki.finder',
  'kwiki.auth',
  'kwiki.chat',
  'services.socket',
  'services.user',
  'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      templateUrl: 'auth/login.html',
      controller: 'AuthController',
      url: '/login',
      data: {
        requireLogin: false
      }
    })
    .state('signup', {
      templateUrl: 'auth/signup.html',
      controller: 'AuthController',
      url: '/signup',
      data: {
        requireLogin: false
      }
    })
    .state('finder', {
      templateUrl: 'finder/finder.html',
      controller: 'FinderController',
      url: '/finder',
      data: {
        requireLogin: true
      }
    })
    .state('chat', {
      templateUrl: 'chat/chat.html',
      controller: 'ChatController',
      url: '/chat',
      data: {
        requireLogin: true
      }
    });

}])

.run(['$rootScope', '$state', 'User', function ($rootScope, $state, User) {
  //this function listens for when angular changes states
  //when the state is changed, if the state requires authentication
  //local storage is checked for the JWT
  //if there is no JWT stored in local storage, transition to requested state is prevented
  //state is changed to 'login'
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data.requireLogin && !User.isAuth()) {
      //user isn't authenticated, so transition state to signin
      event.preventDefault(); //prevent state transition from happening
      $state.transitionTo('login'); //transitions state to login
    }
  });
}]);