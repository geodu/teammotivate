/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('newProject', {
      url: '/projects/new',
      templateUrl: '/app/newProject/newProject.html',
      controller: 'NewProjectsCtrl',
      resolve: {
        postPromise: ['users', function(users) {
          return users.get();
        }]
      }
    });
}])

.controller('NewProjectsCtrl', [
  '$http',
  '$scope',
  '$location',
  'users',
  'projects',
  'session',
  function($http, $scope, $location, users, projects, session) {
    $scope.selectedUsers = [];

    $scope.createProject = function() {
      if ($scope.name === '') { return; }
      var newProject = {
        name: $scope.name,
        leader: session.name().username,
        description: $scope.description,
        users: $scope.selectedUsers
      }

      projects.post(newProject).then(
        function(result) {
          var success = result.data.success;
            if (success) {
              $location.path('home');
            }
            else {
              $scope.message = result.data.message;
            }
        });;
    }

    $scope.addUser = function() {
      if (users.users.filter(function(v) {return v.username === $scope.nextUser}).length > 0) {
        $scope.selectedUsers.push($scope.nextUser);
      }
      else {
        $scope.message = 'Not a valid user';
      }
      $scope.nextUser = null;
    }
  }
]);