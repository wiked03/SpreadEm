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
                console.log("Logged in as:" + authData.uid);
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

  $scope.getWeek = function (week) {
    $state.go('app.games', {
      week: week
    });
  }

})

.controller('GamesCtrl', function($scope, $state, Games) {
  $scope.games = Games.all($state.params.week);

})

.controller('MyPicksCtrl', function($scope, $stateParams) {
});
