angular.module('spreadem.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(firebaseUrl);
            return $firebaseAuth(ref);
}])

.factory('Leaderboard', function ($firebase) {

    var selectedRoomId;

    var ref = new Firebase(firebaseUrl+"/users");
    var users = [];

    return {
        all: function () {

			ref.orderByChild("score").on("child_added", function(data) {
				users.push(data.val());
			});
			return users;
        }

    }
})


.factory('Weeks', function ($firebase) {

	var weeks = [
		{"id": 6, "startDate" : new Date("2015-10-06").getTime(), "endDate": new Date("2015-10-13").getTime()},
		{"id": 7, "startDate" : new Date("2015-10-13").getTime(), "endDate": new Date("2015-10-20").getTime()},
		{"id": 8, "startDate" : new Date("2015-10-20").getTime(), "endDate": new Date("2015-10-27").getTime()},
		{"id": 9, "startDate" : new Date("2015-10-27").getTime(), "endDate": new Date("2015-11-03").getTime()},
		{"id": 10, "startDate" : new Date("2015-11-03").getTime(), "endDate": new Date("2015-11-10").getTime()},
		{"id": 11, "startDate" : new Date("2015-11-10").getTime(), "endDate": new Date("2015-11-17").getTime()},
		{"id": 12, "startDate" : new Date("2015-11-17").getTime(), "endDate": new Date("2015-11-24").getTime()},
		{"id": 13, "startDate" : new Date("2015-11-24").getTime(), "endDate": new Date("2015-12-01").getTime()},
		{"id": 14, "startDate" : new Date("2015-12-01").getTime(), "endDate": new Date("2015-12-08").getTime()}
	];

	var displayWeeks = [
		{"id": 6, "startDate" : "Oct 6, 2015", "endDate": "Oct 12, 2015"},
		{"id": 7, "startDate" : "Oct 13, 2015", "endDate": "Oct 19, 2015"},
		{"id": 8, "startDate" : "Oct 20, 2015", "endDate": "Oct 26, 2015"},
		{"id": 9, "startDate" : "Oct 27, 2015", "endDate": "Nov 2, 2015"},
		{"id": 10, "startDate" : "Nov 3, 2015", "endDate": "Nov 9, 2015"},
		{"id": 11, "startDate" : "Nov 10, 2015", "endDate": "Nov 16, 2015"},
		{"id": 12, "startDate" : "Nov 17, 2015", "endDate": "Nov 22, 2015"},
		{"id": 13, "startDate" : "Nov 24, 2015", "endDate": "Nov 30, 2015"},
		{"id": 14, "startDate" : "Dec 1, 2015", "endDate": "Dec 7, 2015"}
	];

    return {
        all: function () {
          return displayWeeks;
        },
		getCurrentWeek: function () {
			var today = new Date().getTime();
			var i;
			for (i = 0; i < weeks.length; ++i) {
				if (today >= weeks[i].startDate && today < weeks[i].endDate) {
					return weeks[i].id;
				}
			}
			return 1;  // Can't find the week... just return to week 1
		}
    }
})

.factory('Games', function ($firebase, $firebaseArray) {

	var games = [];
	var game;

	return {
		all: function (week) {
			var gamesRef = new Firebase(firebaseUrl+'/games/week'+week);
			var games = $firebaseArray(gamesRef);
			return games;
		},
		getGame: function (week, key) {
			var ref = new Firebase(firebaseUrl+"/games/week"+week+"/"+key);
			ref.on('value', function(data) {
				game = data.val();
			});
			return game;
    }
  }
})

.factory('Picks', function ($firebase, $rootScope, $firebaseArray) {

	return {
		savePickForUser: function (key, choice, week) {
      var pickRef = new Firebase(firebaseUrl+"/users/"+$rootScope.uid+"/week"+week+"/"+key);
			pickRef.update({
        'pick': choice
			});
		},
    getUserPicks: function (week) {
      var pickRef = new Firebase(firebaseUrl+"/users/"+$rootScope.uid+"/week"+week);
      var picks = $firebaseArray(pickRef);
      return picks;

    }
  }
});
