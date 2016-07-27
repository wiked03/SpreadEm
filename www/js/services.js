angular.module('spreadem.services', ['firebase'])

.factory("Auth", ["$firebaseAuth", "$rootScope", function ($firebaseAuth, $rootScope) {
	var ref = new Firebase(firebaseUrl);
	return $firebaseAuth(ref);
}])

.factory('Leaderboard', function ($firebase) {

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
		{"id": 1, "startDate" : new Date("2016-08-26").getTime(), "endDate": new Date("2016-09-05").getTime()},
		{"id": 2, "startDate" : new Date("2016-09-06").getTime(), "endDate": new Date("2016-09-12").getTime()},
		{"id": 3, "startDate" : new Date("2016-09-13").getTime(), "endDate": new Date("2016-09-19").getTime()},
		{"id": 4, "startDate" : new Date("2016-09-20").getTime(), "endDate": new Date("2016-09-26").getTime()},
		{"id": 5, "startDate" : new Date("2016-09-27").getTime(), "endDate": new Date("2016-10-03").getTime()},
		{"id": 6, "startDate" : new Date("2016-10-04").getTime(), "endDate": new Date("2016-10-10").getTime()},
		{"id": 7, "startDate" : new Date("2016-10-11").getTime(), "endDate": new Date("2016-10-17").getTime()},
		{"id": 8, "startDate" : new Date("2016-10-18").getTime(), "endDate": new Date("2016-10-24").getTime()},
		{"id": 9, "startDate" : new Date("2016-10-25").getTime(), "endDate": new Date("2016-10-31").getTime()},
		{"id": 10, "startDate" : new Date("2016-11-01").getTime(), "endDate": new Date("2016-11-07").getTime()},
		{"id": 11, "startDate" : new Date("2016-11-08").getTime(), "endDate": new Date("2016-11-14").getTime()},
		{"id": 12, "startDate" : new Date("2016-11-15").getTime(), "endDate": new Date("2016-11-21").getTime()},
		{"id": 13, "startDate" : new Date("2016-11-22").getTime(), "endDate": new Date("2016-11-28").getTime()},
		{"id": 14, "startDate" : new Date("2016-11-29").getTime(), "endDate": new Date("2016-12-05").getTime()},
		{"id": 15, "startDate" : new Date("2016-12-06").getTime(), "endDate": new Date("2016-12-12").getTime()}
	];

	var displayWeeks = [
		{"id": 1, "startDate" : "2016-08-26", "endDate": "2016-09-05"},
		{"id": 2, "startDate" : "2016-09-06", "endDate": "2016-09-12"},
		{"id": 3, "startDate" : "2016-09-13", "endDate": "2016-09-19"},
		{"id": 4, "startDate" : "2016-09-20", "endDate": "2016-09-26"},
		{"id": 5, "startDate" : "2016-09-27", "endDate": "2016-10-03"},
		{"id": 6, "startDate" : "2016-10-04", "endDate": "2016-10-10"},
		{"id": 7, "startDate" : "2016-10-11", "endDate": "2016-10-17"},
		{"id": 8, "startDate" : "2016-10-18", "endDate": "2016-10-24"},
		{"id": 9, "startDate" : "2016-10-25", "endDate": "2016-10-31"},
		{"id": 10, "startDate" : "2016-11-01", "endDate": "2016-11-07"},
		{"id": 11, "startDate" : "2016-11-08", "endDate": "2016-11-14"},
		{"id": 12, "startDate" : "2016-11-15", "endDate": "2016-11-21"},
		{"id": 13, "startDate" : "2016-11-22", "endDate": "2016-11-28"},
		{"id": 14, "startDate" : "2016-11-29", "endDate": "2016-12-05"},
		{"id": 15, "startDate" : "2016-12-06", "endDate": "2016-12-12"}
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
		savePickForUser: function (week, home, away, odds, choice) {
			var pickRef = new Firebase(firebaseUrl+"/users/"+$rootScope.uid+"/week"+week+"/"+home);
			pickRef.update({
				'home': home,
				'away': away,
				'odds': odds,
				'pick': choice
			});
		},
		getUserPicks: function (week) {
			var pickRef = new Firebase(firebaseUrl+"/users/"+$rootScope.uid+"/week"+week);
			var picks = $firebaseArray(pickRef);
			//console.log(picks);
			return picks;
		}
	}
});
