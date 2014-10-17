
var ngapp = angular.module('ngapp', []);

ngapp.controller('gameController', 
[
	'$scope', '$http', 'gameFactory', 'sessionFactory', 'alertFactory', 
  	function ($scope, $http, gameFactory, sessionFactory, alertFactory) {
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

      $scope.challenge = function (username){
        var sessionUser = sessionFactory.getSessionUsername();
        var players = {
            p1 : sessionUser,
            p2 : username
          };
        console.log('trying to challenge ' + username + ' with ' + sessionUser);
        gameFactory.createGame(players)
          .success(function(data, status, headers, config) {
            alertFactory.alert('<font color="purple">' + username + '</font> was successfully challenged', 'success');
            gameFactory.getGames()
              .success(function(data, status, headers, config) {
                  $scope.games = data;
              }).
              error(function(data, status, headers, config) {
                  console.log(data);
              });
          }).
          error(function(data, status, headers, config) {
              console.log(data);
              alertFactory.alert(data, 'danger');
          });
      }

      $scope.isPlayersTurn = function (username) {
        return function( item ) {
          return item.gamestate.playerToMove === username;
        };
      }

      $scope.isOpponentsTurn = function (username) {
        return function( game ) {
          return game.gamestate.playerToMove === gameFactory.getOpponent(username, game);
        };
      }

      $scope.isGameOver = function (username) {
        return function( game ) {
          return gameFactory.isGameOver(game);
        };
      }

      $scope.getOpponent = function (user, game) {
        return gameFactory.getOpponent(user, game);
      }

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
  '$scope', 'sessionFactory', 'userFactory', 'validFactory',   
    function ($scope, sessionFactory, userFactory, validFactory) { 
      $scope.isAuthenticated = function () { 
        return sessionFactory.getSessionId() != "undefined" && sessionFactory.getSessionId() != undefined;
      };
      $scope.getSessionId = function () { 
        return sessionFactory.getSessionId();
      };
      $scope.getSessionUsername = function () { 
        return sessionFactory.getSessionUsername();
      };
      $scope.createSession = function (user) { 
        $('.cover').fadeIn('fast', function(){
          sessionFactory.createSession(user.username, user.password);
        });
        
      };
      $scope.deleteSession = function () { 
        $('.cover').show();
        sessionFactory.deleteSession();
      };
      $scope.createUser = function (user) { 
        
        return userFactory.createUser(user);
      };
      $scope.validEmail = function (email, id, parent, button) { 
        console.log("validating email: " + email);
        $scope.emailError = validFactory.validEmail(email, id);
        console.log('changing ' + button + ' disabled to ' + !validFactory.validRegistration(parent));
        $('#'+button).prop('disabled', !validFactory.validRegistration(parent))
      };
      
      $scope.validUsername = function (username, id, parent, button) { 
        console.log("validating username: " + username);
        $scope.usernameError = validFactory.validUsername(username, id);
        console.log('changing ' + button + ' disabled to ' + !validFactory.validRegistration(parent));
        $('#'+button).prop('disabled', !validFactory.validRegistration(parent))
      };

      $scope.validPassword = function (password, id, parent, button) { 
        console.log("validating password: " + password);
        $scope.passwordError = validFactory.validPassword(password, id);
        console.log('changing ' + button + ' disabled to ' + !validFactory.validRegistration(parent));
        $('#'+button).prop('disabled', !validFactory.validRegistration(parent))
      };

      $scope.validLogin = function (username, password, button) { 
        $('#'+button).prop('disabled', !(username != undefined && username != "" && password != undefined && password != ""));
      };
    }
]);


