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
	function($scope, projects, session) {
  	console.log(projects);
  	console.log(session);
  	$scope.user = session.name;
  	$scope.projects = projects.projects;

    $scope.isLoggedIn = function() {
      return session.name !== undefined;
    }
}])