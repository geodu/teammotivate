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
  'projects',
  function($scope, $stateParams, projects) {
    console.log(projects);
    console.log($stateParams);
    $scope.post = projects.projects[$stateParams.id];
    console.log(projects.projects);
    console.log($scope);
    $scope.addTask = function() {
      if ($scope.body === '') { return; }
      $scope.project.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}])