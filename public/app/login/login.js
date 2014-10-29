/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {
    	url: '/login',
    	templateUrl: '/app/login/login.html',
    	controller: 'SessionCtrl'
    });
}])

.controller('SessionCtrl', [
	'$http',
	'$scope',
	'$location',
	'session',
	function($http, $scope, $location, session) {
		if (session.name()) {
			$http.post('/sessions', session.name()).success(function(response) {
				if (response.success) {
			  	$location.path('home');
			  } else {
			  	session.clear();
			  }
			});
		}

		$scope.authenticate = function() {
			if ($scope.name === '') { return; }
			var userFields = {
				username: $scope.name,
				password: $scope.password
			}
			$http.post('/sessions', userFields).success(function(response) {
		  	if (response.success === true) {
		  		session.setName(userFields);
		  		$location.path('home');
		  	}
			});
			$scope.name = '';
			$scope.password = '';
		}
	}
])