/**
 * Authors: George Du, Rujia Zha
 */

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
  '$location',
  'tasks',
  function($scope, $stateParams, $location, tasks) {
    $scope.tasks = {};
    tasks.get($stateParams.id1, $stateParams.id2).then(
      function(result) {
        $scope.task = result.data.task;
        $scope.task.deadline = new Date($scope.task.deadline);
      });

    $scope.updateTask = function() {
      if ($scope.body === '') { return; }
      var updatedTask = {
        assignee: $scope.task.assignee,
        description: $scope.task.description,
        deadline: $scope.task.deadline.toString(),
        completion: $scope.task.completion,
        etc: $scope.task.etc
      }

      tasks.put(updatedTask, $stateParams.id1, $stateParams.id2).then(
        function(result) {
          var success = result.data.success;
            if (success) {
              $location.path('home');
            }
            else {
              $scope.message = result.data.message;
            }
        });
    }
}])