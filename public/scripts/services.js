var myApp = angular.module('gameFactory', []);

angular.module('gameFactory')
    .factory('gameFactory', ['$http', function($http) {

    var urlBase = '/game/';
    var gameFactory = {};

    gameFactory.getGames = function () {
        return $http.get(urlBase);
    };

    gameFactory.getGame = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    gameFactory.createGame = function (players) {
        return $http.post(urlBase + 'create/', players);
    };

    return gameFactory;
}]);