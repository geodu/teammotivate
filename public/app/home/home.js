angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('home', {
      url: '/home',
      templateUrl: '/app/home/home.html',
      controller: 'MainCtrl',
      resolve: {
			  postPromise: ['projects', function(projects) {
			    return projects.getAll();
			  }]
			}
    });
}])

.controller('MainCtrl', [
	'$scope',
	'projects',
	'session',
  'tasks',
	function($scope, projects, session, tasks) {
  	console.log(projects);
  	console.log(session);
  	$scope.user = session.name;
  	$scope.projects = projects.projects;
    $scope.tasks = {};
    for (var i = 0; i < $scope.projects.length; i++) {
      tasks.getTasks($scope.projects[i]._id);
      $scope.tasks[$scope.projects[i]._id] = tasks.tasks;
    }
    console.log($scope.tasks);


    $scope.isLoggedIn = function() {
      return session.name !== undefined;
    }

}])