var myApp = angular.module('gameFactory', []);

angular.module('gameFactory')
    .factory('gameFactory', ['$http', 'sessionFactory', function($http, sessionFactory) {

    var urlBase = '/game/';
    var gameFactory = {};

    gameFactory.getGames = function () {
        var data = { username : sessionFactory.getSessionUsername };
        console.log('looking for games with username ' + data.username);
        return $http.get(urlBase, data);
    };

    gameFactory.getGame = function (id) {
        return $http.post(urlBase + '/' + id);
    };

    gameFactory.createGame = function (players) {
        return $http.post(urlBase + 'create/', players);
    };

    gameFactory.getOpponent = function (user, game){
        if (game.p1 == user){
            return game.p2;
        }
        return game.p1;
    }

    gameFactory.isPlayersTurn = function (game) {
        return gameFactory.isPlayersTurn(game);
    }

    gameFactory.isGameOver = function (game){
        if (game.gamestate.winner == game.p1 || game.gamestate.winner == game.p2){
            return true;
        }
        return false;
    }

    return gameFactory;
}]);

var myApp = angular.module('sessionFactory', []);

angular.module('sessionFactory')
    .factory('sessionFactory', ['$http', '$cookies', '$location', 'alertFactory', function($http, $cookies, $location, alertFactory) {

    var urlBase = '/session/';
    var sessionFactory = {};

    sessionFactory.getSessionId = function () {
        return $cookies.session;
    };

    sessionFactory.getSessionUsername = function () {
        return $cookies.username;
    };

    sessionFactory.createSession = function (username, password) {
        $http.post(urlBase + 'create/', username, password)
            .success(function(data, status, headers, config) {
                $cookies.username = data.username;
                $cookies.session = data._id;
                alertFactory.clear();
                //alertFactory.alert('', 'success');
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                alertFactory.alert(data, 'danger');
            });
        
    }

    sessionFactory.deleteSession = function () {
        
        $http.post(urlBase + 'delete/', $cookies.session);
        $cookies.session = undefined;
        $cookies.username = undefined;
        console.log('logged out: ' + $cookies.session + ' ' + $cookies.username);
        alertFactory.clear();
        $location.path( "/" );

    };

    return sessionFactory;
}]);

var myApp = angular.module('alertFactory', []);

angular.module('alertFactory')
    .factory('alertFactory', [function() {

    var alertFactory = {};

    alertFactory.alert = function (message, type) {
        
        $('.alert').remove();

        console.log('alert called');
        var alert = $('<div/>');
        alert.addClass('alert');
        alert.addClass('alert-dismissable');
        alert.addClass('alert-' + type);

        var dismiss = $('<button type="button" data-dismiss="alert">x</button>');
        dismiss.addClass('close');

        var message = $('<strong/>').html(message);

        alert.append(dismiss);
        alert.append(message);

        alert.fadeIn('slow');
        $('#alerts').append(alert);

    };

    alertFactory.clear = function () {
        
        $('.alert').remove();

    };

    return alertFactory;
}]);

var myApp = angular.module('userFactory', []);

angular.module('userFactory')
    .factory('userFactory', ['$http', 'sessionFactory', 'alertFactory', function($http, sessionFactory, alertFactory) {

    var urlBase = '/user/';
    var userFactory = {};

    userFactory.getUser = function (user) {
        return $http.post(urlBase, user);
    };

    userFactory.createUser = function (user) {
        console.log("create user called " + user.email);
        $http.post(urlBase + 'create/', user)
            .success(function(data, status, headers, config) {
                console.log("user created");
                alertFactory.alert('<font color="black">' + user.username + '</font> was successfully signed up!<br />Now sign in to play!', 'success');
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                alertFactory.alert(data, 'danger');
            });
        };

    return userFactory;
}]);
