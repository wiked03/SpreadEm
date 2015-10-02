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
          users.sort(function(a,b) {
              return a.score - b.score;
          })
          return users;
        }

    }
})


.factory('Weeks', function ($firebase) {

    return {
        all: function () {
          var weeksRef = new Firebase(firebaseUrl+'/weeks');
          var weeks = [];
          var newWeek = function (id, start, end) {
            this.id = id;
            this.startDate = start;
            this.endDate = end;
          };

          weeksRef.orderByKey().on("value", function(snapshot) {
            snapshot.forEach(function(data) {
              var temp = data.val();
              var week = new newWeek(data.key(), temp.firstDate, temp.lastDate);
              weeks.push(week);
            });
          });
          return weeks;
        }
    }
})

.factory('Games', function ($firebase, $firebaseArray) {

  return {
    all: function (week) {
      var gamesRef = new Firebase(firebaseUrl+'/games/week'+week);
      var games = $firebaseArray(gamesRef);
      return games;
    },
	get: function (week, key) {
      var ref = new Firebase(firebaseUrl+"/games/week"+week+"/"+key);
      ref.on("value", function(snapshot) {
			var game = snapshot.val();
			return game; 
	  })
    }
  }
});
