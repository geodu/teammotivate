angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('taskUpdate', {
      url: '/projects/{id1}/tasks/{id2}',
      templateUrl: '/app/taskUpdate/taskUpdate.html',
      controller: 'TasksCtrl',
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

    $scope.tasks = {};
    tasks.get($stateParams.id1, $stateParams.id2).then(
      function(result) {
        console.log(result);
        console.log(result.data.task);
        $scope.task = result.data.task;
        console.log($scope.task);
      });

    $scope.updateTask = function() {
      if ($scope.body === '') { return; }
      var updatedTask = {
        assignee: $scope.task.assignee,
        description: $scope.task.description,
        deadline: $scope.task.deadline,
        completion: $scope.task.completion, 
        etc: $scope.task.etc
      }

      console.log(updatedTask);
      tasks.put(updatedTask, $stateParams.id1, $stateParams.id2);
    }
}])