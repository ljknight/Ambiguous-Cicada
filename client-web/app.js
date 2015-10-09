/*global angular*/
angular.module('kwiki', [
  'kwiki.finder',
  'kwiki.auth',
  'kwiki.chat',
  'kwiki.waiting',
  'kwiki.oauth',
  'services.socket',
  'services.user',
  'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise(function($injector) {
    var $state = $injector.get('$state');
    $state.go('finder');
  });

  $stateProvider
    .state('login', {

      views: {

        page: {
            templateUrl: 'auth/login.html',
            controller: 'AuthController',
          }
      },

      url: '/login',
      data: {
        requireLogin: false
      }
    })
    .state('signup', {

      views: {

        page: {
            templateUrl: 'auth/signup.html',
            controller: 'AuthController',
          }
      },
      
      url: '/signup',
      data: {
        requireLogin: false
      }
    })
    .state('finder', {

      views: {
          
        nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

        page: {
            templateUrl: 'finder/finder.html',
            controller: 'FinderController',
          }
      },

      url: '/finder',
      data: {
        requireLogin: true
      }
    })
    .state('waiting', {
      views: {
        page: {
          templateUrl: 'waiting/waiting.html',
          controller: 'WaitingController'
        }
      },
      url: '/waiting',
      data: {
        requireLogin: true
      }
    })
    .state('chat', {

      views: {
          
        nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

        page: {
            templateUrl: 'chat/chat.html',
            controller: 'ChatController',
          }
      },

      url: '/chat',
      data: {
        requireLogin: true
      }
    })
    .state('oauth', {

      views: {

        page: {
            templateUrl: 'oauth/oauth.html',
            controller: 'OAuthController',
          }
      },
    
      url: '/oauth',
      data: {
        requireLogin: false
      }
    });

}])

.run(['$rootScope', '$state', 'User', 'Socket', function ($rootScope, $state, User, Socket) {
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

    if (fromState === 'chat') {
      Socket.emit('leaveRoom');
    }

  });
}]);
