angular.module('spreadem.controllers', [])

.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    //console.log('Login Controller Initialized');

    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname,
                    score: 0
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }

    $scope.signIn = function (user) {

        if (user && user.email && user.pwdForLogin) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            auth.$authWithPassword({
                email: user.email,
                password: user.pwdForLogin
            }).then(function (authData) {
				$rootScope.uid = authData.uid;
                console.log("Logged in as:" + $rootScope.uid);
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                    // To Update AngularJS $scope either use $apply or $timeout
                    $scope.$apply(function () {
                        $rootScope.displayName = val;
					});
                });
                $ionicLoading.hide();

                $state.go('app.leaderboard');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter email and password both");
    }
})



.controller('MainCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('LeaderboardCtrl', function($scope, Leaderboard) {
	$scope.users = Leaderboard.all();

})

.controller('WeeksCtrl', function($scope, $state, Weeks) {
  $scope.weeks = Weeks.all();

  $scope.currentWeek = Weeks.getCurrentWeek();

  $scope.getWeek = function (week) {
    $state.go('app.games', {
      week: week
    });
  }

})

.controller('GamesCtrl', function($scope, $stateParams, $state, Games, Picks) {
	$scope.week = $stateParams.week;
	$scope.games = Games.all($stateParams.week);
	$scope.picks = Picks.getUserPicks($scope.week);
  
//	$scope.$on('$ionicView.enter', function () {
//		var i;
//		for(i = 0; i < $scope.picks.length; i++) {
//			var j;
//			for(j = 0; j < $scope.games.length; j++) {
//				if ($scope.picks[i].$id === $scope.games[j].$id) {
//					$scope.games[j].selected = true;
//					break;
//				}
//				console.log($scope.games[j]);				
//			}
//		}
//  })
  
    $scope.isPicked = function (key) {
		var i;
		for(i = 0; i < $scope.picks.length; i++) {
			//console.log($scope.picks[i].$id + " " + key);
			if ($scope.picks[i].$id === key) {
				return true;
			}
		}
		return false;
	}

  $scope.getGame = function (key, week) {
	  console.log(key);
    $state.go('app.pick', {
	  key : key,
	  week : week
    });
  }

})

.controller('PickCtrl', function($scope, $state, $stateParams, Games, Picks, $ionicPopup) {
	$scope.week = $stateParams.week;
	$scope.choice;
	$scope.game = Games.getGame($scope.week, $stateParams.key);
    $scope.picks = Picks.getUserPicks($scope.week);

	showError = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Error',
			template: msg
		});
		alertPopup.then(function(res) {
			$state.go('app.games', {
				week: $scope.week
			});
		});
	}

	$scope.showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirmation',
			template: 'Pick ' + $scope.choice + '?'
		});
		confirmPopup.then(function(res) {
			console.log($scope.choice);
			if(res) {
				console.log($scope.picks);
				if ($scope.picks.length >= 5) {
					showError("Sorry, you have already picked 5 games!");
				} else if ($scope.game.date <= new Date().toISOString()) {
					showError("Sorry, that game has already started!");
				} else {
					Picks.savePickForUser($scope.week, $scope.game.home, $scope.game.away, $scope.game.odds, $scope.choice);
					$state.go('app.mypicks', {
						week: $scope.week
					});
				}
			} else {
				$state.go('app.mypicks', {
					week: $scope.week
				});
			}
		});
	}

})

.controller('MyPicksCtrl', function($scope, $stateParams, Picks, Weeks, Games) {
	console.log("in MyPicksCtrl");
	$scope.shouldShowDelete = false;
	$scope.week = Weeks.getCurrentWeek();
	$scope.picks = Picks.getUserPicks($scope.week);
});
