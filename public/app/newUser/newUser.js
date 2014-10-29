/**
 * Authors: George Du, Michael Choi
 */

angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('newUser', {
    	url: '/users/new',
    	templateUrl: '/app/newUser/newUser.html',
    	controller: 'NewUsersCtrl'
    });
}])

.controller('NewUsersCtrl', [
	'$http',
	'$scope',
  '$location',
	'users',
	function($http, $scope, $location, users) {
		$scope.addUser = function() {
			if ($scope.name === '') { return; }
			var newUser = {
				username: $scope.name,
				password: $scope.password,
				department: $scope.department
			}
			users.post(newUser).then(
				function (results) {
					var success = results.data.success;
					if (success) {
						$location.path('sessions');
					}
					else {
						$scope.message = results.data.message;
					}
				});
			$scope.name = '';
			$scope.password = '';
			$scope.department = '';
		}
	}
])