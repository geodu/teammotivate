angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('userlist', {
      url: '/users',
      templateUrl: '/app/userlist/userlist.html',
      controller: 'UsersCtrl',
      resolve: {
        postPromise: ['users', function(users) {
          return users.get();
        }]
      }
    });
}])

.controller('UsersCtrl', [
  '$http',
  '$scope',
  'users',
  function($http, $scope, users) {
    console.log(users.users);
    $scope.users = users.users;
  }
])