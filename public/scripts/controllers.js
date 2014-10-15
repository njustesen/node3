
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

