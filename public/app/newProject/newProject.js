angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('newProject', {
      url: '/projects/new',
      templateUrl: '/app/newProject/newProject.html',
      controller: 'NewProjectsCtrl'
    });
}])

.controller('NewProjectsCtrl', [
  '$http',
  '$scope',
  '$location',
  'users',
  'session',
  function($http, $scope, users, session) {
    console.log('in NewProjectsCtrl')
    console.log(users);
    $scope.users = users.users;

    $scope.createProject = function() {
      if ($scope.name === '') { return; }
      var newProject = {
        username: $scope.name,
        password: $scope.password
      }

      console.log(newProject);
      projects.post(newProject);
      $scope.name = '';
      $scope.password = '';
      $location.path('home');
    }
  }
]);