
var ngapp = angular.module('ngapp', []);

ngapp.controller('gameController', 
[
	'$scope', '$http', 'gameFactory', 
  	function ($scope, $http, gameFactory) {
    	$scope.status;
      $scope.games;
      $scope.orders;

      getGames();

      function getGames() {
          gameFactory.getGames()
              .success(function (games) {
                  console.log("games: " + games);
                  $scope.games = games;
              })
              .error(function (error) {
                  $scope.status = 'Unable to load game data: ' + error.message;
              });
      }

      $scope.createGame = function (players) {
          console.log("P1: " + players.p1 + ", P2: " + players.p2);
          gameFactory.createGame(players)
              .success(function () {
                  $scope.status = 'Inserted Game! Refreshing Game list.';
                  getGames();
              }).
              error(function(error) {
                  $scope.status = 'Unable to create Game: ' + error.message;
              });
      };
    }
]);

ngapp.controller('aboutController', 
[
	'$scope', '$http',
  	function ($scope, $http) {
    	$scope.test = 'about-test';
  	}
]);

ngapp.controller('rankingController', 
[
	'$scope', '$http',
  	function ($scope, $http) {
    	$scope.test = 'ranking-test';
  	}
]);

ngapp.controller('locationController', 
[
  '$scope', '$location',
    function ($scope, $location) { 
      $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
      };
    }
]);

ngapp.controller('sessionController', 
[
  '$scope', 'sessionFactory', 'userFactory', 
    function ($scope, sessionFactory, userFactory) { 
      $scope.isAuthenticated = function () { 
        return sessionFactory.getSession() != "undefined" && sessionFactory.getSession() != undefined;
      };
      $scope.getSession = function () { 
        return sessionFactory.getSession();
      };
      $scope.createSession = function (username, password) { 
        return sessionFactory.createSession(username, password);
      };
      $scope.deleteSession = function () { 
        return sessionFactory.deleteSession();
      };
      $scope.createUser = function (user) { 
        return userFactory.createUser(user);
      };
    }
]);


