/**
 * Authors: George Du, Michael Choi, Rujia Zha
 */

angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('projectUpdate', {
      url: '/projects/{id}',
      templateUrl: '/app/projectUpdate/projectUpdate.html',
      controller: 'ProjectsCtrl'
    });
}])

.controller('ProjectsCtrl', [
  '$scope',
  '$stateParams',
  '$location',
  'users',
  'projects',
  'tasks',
  function($scope, $stateParams, $location, users, projects, tasks) {
    var usersOnProject = [];

    // Helper function to set the fields in $scope.
    var formatProject = function(result) {
      var project = result.data.project;
      usersOnProject = project.users;
      for (var i = 0; i < project.tasks.length; i++) {
        var date = new Date(project.tasks[i].deadline);
        project.tasks[i].deadline = (date.getMonth() + 1) + '/' + date.getDate();
      }
      $scope.project = project;

      $scope.users = project.users[0];
      for (var i = 1; i < project.users.length; i++) {
        $scope.users = $scope.users + ', ' + project.users[i];
      }
    }

    $scope.add = true;
    $scope.update = true;
    $scope.message = '';
    projects.get($stateParams.id).then(
      function(result) {
        formatProject(result);
      });

    $scope.toggleTask = function() {
      $scope.add = !$scope.add;
    }

    $scope.toggleProject = function() {
      $scope.update = !$scope.update;
    };

    $scope.addTask = function() {
      if (!$scope.deadline) {
        $scope.message = 'Need a deadline';
        $scope.add = false;
        return;
      }
      if (usersOnProject.indexOf($scope.assignee) === -1) {
        $scope.message = 'Not a valid assignee';
        $scope.add = false;
        return;
      }
      var newTask = {
        assignee: $scope.assignee,
        description: $scope.description,
        deadline: $scope.deadline.toString(),
        etc: $scope.etc
      }

      tasks.addTask($stateParams.id, newTask).then(
        function(results) {
          var success = results.data.success;
          if (success) {
            $scope.message = "";
            $scope.add = true;
            projects.get($stateParams.id).then(
              function(result) {
                formatProject(result);
              });
          }
          else {
            $scope.message = results.data.message;
            $scope.add = false;
          }
        });

      $scope.assignee = '';
      $scope.description = '';
      $scope.etc = '';
      $scope.date = '';
    };

    $scope.updateProject = function() {
      var updatedProj = {
        name: $scope.project.name,
        description: $scope.project.description,
        leader: $scope.project.leader,
        users: $scope.project.users
      }

      projects.update($stateParams.id, updatedProj).then(
        function(results) {
          var success = results.data.success;
          if (!results.data.success) {
            $scope.message = results.data.message;
          }
          $scope.projName = '';
          $scope.projDescription = '';
        });
    };

    $scope.deleteTask = function(projID, taskID) {
      tasks.delete(projID, taskID);
      projects.get($stateParams.id).then(
        function(result) {
          formatProject(result);
        });
    }
}])