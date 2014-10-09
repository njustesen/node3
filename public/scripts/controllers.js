var ngapp = angular.module('ngapp', []);

ngapp.controller('gameController', 
[
	'$scope', '$http',
  	function ($scope, $http) {
    	$scope.test = 'game-test';
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

