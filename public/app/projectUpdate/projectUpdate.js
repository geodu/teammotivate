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
  'users',
  'projects',
  'tasks',
  function($scope, $stateParams, users, projects, tasks) {
    //$scope.project = projects.projects.filter(function(v) {return v._id === $stateParams.id})[0]
    console.log($scope.project);
    projects.get($stateParams.id).then(
      function(result) {
        console.log(result.data);
        $scope.project = result.data.project;
      });

    $scope.addTask = function() {
      // if (users.users.filter(function(v) {return v.username === $scope.assignee}).length === 0) {
      //   return;
      // }
      var newTask = {
        assignee: $scope.assignee,
        description: $scope.description,
        deadline: $scope.deadline,
        etc: $scope.etc
      }

      console.log(newTask);
      tasks.addTask($stateParams.id, newTask); 
      $scope.project.tasks.push(newTask); 
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
}])