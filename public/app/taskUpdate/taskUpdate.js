angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('taskUpdate', {
      url: '/{id1}/tasks/{id2}',
      templateUrl: '/app/taskUpdate/taskUpdate.html',
      controller: 'TasksCtrl'
    });
}])

.controller('TasksCtrl', [
  '$scope',
  '$stateParams',
  'tasks',
  function($scope, $stateParams, tasks) {
    console.log(tasks);
    console.log($stateParams);
    console.log($scope);

    $scope.updateTask = function() {
      if ($scope.body === '') { return; }
      var updatedTask = {
        assignee: $scope.assignee,
        description: $scope.description,
        deadline: $scope.deadline,
        completion: $scope.completion, 
        etc: $scope.etc
      }

      console.log(updatedTask);
      tasks.post(updatedTask, stateParams.id1, stateParams.id2);
    }
}])

