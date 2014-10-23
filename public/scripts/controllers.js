
var ngapp = angular.module('ngapp', []);

ngapp.controller('gameController', 
[
	'$scope', '$http', '$location', 'gameFactory', 'sessionFactory', 'alertFactory', 
  	function ($scope, $http, $location, gameFactory, sessionFactory, alertFactory) {
    	$scope.status;
      $scope.games;
      $scope.orders;

      alertFactory.clear();
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

      $scope.go = function (id) {
        console.log(id);
        $location.path( '/play/' + id );
      };

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
            $location.path( '/play/' + data );
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

      $scope.isGameOver = function (game) {
        return function (game){
          if (game.winner == game.p1 || game.winner == game.p2){
            return true;
          }
          return false;
        }
      }

      $scope.getOpponent = function (user, game) {
        return gameFactory.getOpponent(user, game);
      }

      $scope.wonText = function (game, username) {
        if (game.gamestate.winner === username){
          return "Won";
        }
        if (game.gamestate.winner === null){
          return "Draw";
        }
        if (game.gamestate.winner !== ""){
          return "Lost";
        }
        return "";
      }

    }
]);

ngapp.controller('aboutController', 
[
	'$scope', '$http',
  	function ($scope, $http) {
      alertFactory.clear();
    	$scope.test = 'about-test';
  	}
]);

ngapp.controller('playController', 
[
  '$scope', '$http', '$routeParams', 'sessionFactory', 'gameFactory', 'alertFactory', 
    function ($scope, $http, $routeParams, sessionFactory, gameFactory, alertFactory) {

      var id = $routeParams.id;
      alertFactory.clear();

      var action = {
        x : -1,
        y : -1,
        token : ''
      }
      
      gameFactory.getGame(id)
        .success(function(data, status, headers, config) {
          $scope.game = data;
          if ($scope.game.gamestate.turn%2 == 0){
            action.token = 'x';
          } else {
            action.token = 'o';
          }
          for(var x=0; x < 3; x++){
            for(var y=0; y < 3; y++){
              if ($scope.game.gamestate.grid.charAt(y*3 + x) == ' '){
                $('#grid-'+y+'-'+x).addClass('grid-click');
              }
            }
          }
        }).
        error(function(data, status, headers, config) {
          alertFactory.alert('These are not the games you are looking for!', 'danger');
        });

      $scope.isPlayersTurn = function (username) {
        return function( item ) {
          return item.gamestate.playerToMove === username;
        };
      }

      $scope.gridClick = function (y, x) {
        if ($('#grid-'+y+'-'+x).hasClass('grid-click')){
          if ($('#grid-'+y+'-'+x).hasClass('grid-action')){
            $('#grid-'+y+'-'+x).removeClass('grid-action');
            $('#grid-'+y+'-'+x).html(' ');
            action.x = -1;
            action.y = -1;
          } else {
            $('.grid-action').html(' ');
            $('.grid-action').removeClass('grid-action');
            $('#grid-'+y+'-'+x).addClass('grid-action');
            $('#grid-'+y+'-'+x).html(action.token);
            action.x = x;
            action.y = y;
          }
        }
      }

      $scope.submitAction = function () {
        console.log('submitAction called ');
        if (action.x != -1 && action.y != -1 && action.token != ''){
          gameFactory.performAction($scope.game._id, sessionFactory.getSessionUsername(), action)
            .success(function(data, status, headers, config) {
              if (gameFactory.isGameOver(data)){
                console.log("Game is over");
                console.log(data);
                if (gameFactory.isADraw(data)){
                  alertFactory.alert('The game ended in a draw!', 'warning');
                } else if (data.winner === sessionFactory.getSessionUsername()){
                  alertFactory.alert('You won the game!', 'success');
                } else {
                  alertFactory.alert('You lost the game!', 'danger');
                }
              } else {
                alertFactory.alert("It is now the opponent's turn!", 'info');
              }
              $('.grid-click').removeClass('grid-click');
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                alertFactory.alert(data, 'danger');
            });
        } else {
          console.log(action);
        }
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
        if (game !== undefined){
          return gameFactory.getOpponent(user, game);
        }
      }
    }
]);

ngapp.controller('rankingController', 
[
	'$scope', '$http', 'userFactory', 'alertFactory', 
  	function ($scope, $http, userFactory, alertFactory) {

      alertFactory.clear();

    	userFactory.getUsers()
        .success(function(data, status, headers, config) {
          $scope.users = data;
          console.log($scope.users.length + ' users found');
        }).
        error(function(data, status, headers, config) {
            console.log(data);
            alertFactory.alert(data, 'danger');
        });

      $scope.score = function (user) { 
        return function (user){
          return -(user.won*9999999 + user.draw*2 - user.lost);
        }
      };

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
        //$('.cover').fadeIn('fast', function(){
          sessionFactory.createSession(user.username, user.password);
        //});
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


