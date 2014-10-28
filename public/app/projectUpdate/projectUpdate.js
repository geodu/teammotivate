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
    $scope.project = projects.projects.filter(function(v) {return v._id === $stateParams.id})[0]
    console.log($scope.project);
    $scope.addTask = function() {
    };
}])