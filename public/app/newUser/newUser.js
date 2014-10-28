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
			console.log($scope);
			var newUser = {
				username: $scope.name,
				password: $scope.password,
				department: $scope.department
			}
			console.log(newUser);
      console.log(users);
			users.post(newUser);
			$scope.name = '';
			$scope.password = '';
			$scope.department = '';
      $location.path('sessions');
		}
	}
])