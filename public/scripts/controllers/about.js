var aboutControllers = angular.module('aboutControllers', []);

aboutControllers.controller('aboutController', 
[
	'$scope', '$http',
  	
  	function ($scope, $http) {
    	$scope.test = 'about-test';
  	}
  	
]);
