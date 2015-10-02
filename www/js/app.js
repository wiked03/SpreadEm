
var firebaseUrl = "https://spreadem.firebaseio.com";

angular.module('spreadem', ['ionic', 'firebase', 'spreadem.controllers', 'spreadem.services'])

.run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

	$rootScope.firebaseUrl = firebaseUrl;
    $rootScope.displayName = null;

	Auth.$onAuth(function (authData) {
		if (authData) {
			console.log("Logged in as:", authData.uid);
		} else {
			console.log("Logged out");
			$ionicLoading.hide();
			$location.path('/login');
		}
	});

	$rootScope.logout = function () {
		console.log("Logging out from the app");
		$ionicLoading.show({
			template: 'Logging Out...'
		});
		Auth.$unauth();
	}


	$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
		// We can catch the error thrown when the $requireAuth promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			$location.path("/login");
		}
	});

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
		url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
        }]
        }
    })

    .state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'MainCtrl'
	})

	.state('app.weeks', {
		url: '/weeks',
		views: {
			'menuContent': {
				templateUrl: 'templates/weeks.html',
				controller: 'WeeksCtrl'
			}
		}
	})

  .state('app.games', {
    url: '/games/:week',
    views: {
      'menuContent': {
        templateUrl: 'templates/games.html',
        controller: 'GamesCtrl'
      }
    }
  })

	.state('app.leaderboard', {
		url: '/leaderboard',
		views: {
			'menuContent': {
				templateUrl: 'templates/leaderboard.html',
				controller: 'LeaderboardCtrl'
			}
		}
    })

    .state('app.mypicks', {
		url: '/mypicks',
		views: {
			'menuContent': {
				templateUrl: 'templates/mypicks.html',
				controller: 'MyPicksCtrl'
			}
		}
    })

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
});
