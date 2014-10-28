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
      $scope.tasks.projID = tasks.get($scope.projects[i]._id);
      console.log($scope.projects[i]);
    }


    $scope.isLoggedIn = function() {
      return session.name !== undefined;
    }

}])