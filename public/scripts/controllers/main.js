var mainControllers = angular.module('mainControllers', []);

mainControllers.controller('mainController', 
[
	'$scope', '$http',
  	
  	function ($scope, $http) {
    	$scope.test = 'main-test';
  	}
  	
]);
