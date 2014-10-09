

var node3app = angular.module('node3app', [
	'ngRoute',
	'mainControllers',
	'aboutControllers'
]);

node3app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'view/main.html',
        controller: 'mainController'
      }).
      when('/about/', {
        templateUrl: 'view/about.html',
        controller: 'aboutController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);