angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('taskUpdate', {
      url: '/tasks/{id}',
      templateUrl: '/app/taskUpdate/taskUpdate.html',
      controller: 'TasksCtrl'
    });
}])

.controller('TasksCtrl', [
  '$scope',
  '$stateParams',
  'tasks',
  function($scope, $stateParams, tasks) {
    console.log(projects);
    console.log($stateParams);
    $scope.post = projects.projects[$stateParams.id];
    console.log(projects.projects);
    console.log($scope);
    $scope.updateTask = function() {
      if ($scope.body === '') { return; }
      $scope.project.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}])