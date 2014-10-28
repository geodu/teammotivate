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
    var formatProject = function(result) {
      var project = result.data.project;
      for (var i = 0; i < project.tasks.length; i++) {
        var date = new Date(project.tasks[i].deadline);
        project.tasks[i].deadline = (date.getMonth()+1) + '/' + date.getDate();
      }
      $scope.project = project;
    }


    projects.get($stateParams.id).then(
      function(result) {
        formatProject(result);
      });

    $scope.addTask = function() {
      // if (users.users.filter(function(v) {return v.username === $scope.assignee}).length === 0) {
      //   return;
      // }
      var newTask = {
        assignee: $scope.assignee,
        description: $scope.description,
        deadline: $scope.deadline.toString(),
        etc: $scope.etc
      }

      console.log(newTask);

      tasks.addTask($stateParams.id, newTask).then(
        function() {
          projects.get($stateParams.id).then(
            function(result) {
              formatProject(result);
            });
        });

      //$scope.project.tasks.push(newTask);
      $scope.assignee = '';
      $scope.description = '';
      $scope.etc = '';
      $scope.date = '';
    };

    $scope.updateProject = function() {
      // if (users.users.filter(function(v) {return v.username === $scope.assignee}).length === 0) {
      //   return;
      // }
      var updatedProj = {
        name: $scope.projName,
        description: $scope.projDescription,
        leader: $scope.project.leader,
        users: $scope.project.users
      }

      projects.update($stateParams.id, updatedProj);
      $scope.projName = '';
      $scope.projDescription = '';
    };

    $scope.deleteTask = function(projID, taskID) {
      tasks.delete(projID, taskID);
      projects.get($stateParams.id).then(
        function(result) {
          formatProject(result);
        });
      //$scope.project.tasks.remove(newTask);
    }
}])