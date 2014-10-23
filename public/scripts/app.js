
var node3app = angular.module('node3app', [
	'ngRoute',
	'ngapp',
  'ngCookies',
  'sessionFactory',
  'alertFactory',
  'gameFactory',
  'userFactory',
  'validFactory'
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
      when('/play/:id', {
        templateUrl: 'view/play.html',
        controller: 'playController'
      }).
      otherwise({
        redirectTo: '/game/'
      });
  }]);

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}