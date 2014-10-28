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
  	$scope.user = session.name();
  	$scope.projects = projects.projects;
    $scope.tasks = {};
    for (var i = 0; i < $scope.projects.length; i++) {
      (function(i) {
        var numerator = 0.0;
        var denominator = 0.0;
        tasks.getTasks($scope.projects[i]._id).then(
          function(result) {
            var tasklist = result.data.tasks;
            console.log(i);
            $scope.tasks[$scope.projects[i]._id] = tasklist;
            for (var j = 0; j < result.data.tasks.length; j++) {
              var date = new Date(tasklist[j].deadline);
              tasklist[j].deadline = date.getMonth() + '/' + date.getDay();
              numerator += tasklist[j].completion * tasklist[j].etc;
              denominator += tasklist[j].etc;
              if (denominator !== 0) {
                $scope.projects[i].completion = (numerator / denominator).toFixed(2);
              }
            }
          });
      })(i);
    }

    $scope.deleteProject = function(projID) {
      projects.delete(projID);
      projects.get($stateParams.id).then(
        function(result) {
          formatProject(result);
        });
      //$scope.project.tasks.remove(newTask);
    }

    $scope.isLoggedIn = function() {
      return session.name() !== undefined;
    }

}])