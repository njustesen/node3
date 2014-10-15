
var node3app = angular.module('node3app', [
	'ngRoute',
	'ngapp',
  'gameFactory'
]);

node3app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/game/', {
        templateUrl: 'view/game.html',
        controller: 'gameController'
      }).
      when('/about/', {
        templateUrl: 'view/about.html',
        controller: 'aboutController'
      }).
      when('/ranking/', {
        templateUrl: 'view/ranking.html',
        controller: 'rankingController'
      }).
      otherwise({
        redirectTo: '/game'
      });
  }]);
