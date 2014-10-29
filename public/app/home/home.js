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
  '$location',
	'projects',
	'session',
  'tasks',
	function($scope, $location, projects, session, tasks) {
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
              tasklist[j].deadline = (date.getMonth() + 1) + '/' + date.getDate();
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
      console.log('deleting');
      console.log($scope.projects);
      projects.delete(projID).then(
        function(results) {
          console.log(results);
          if (results.data.success) {
            for (var i = 0; i < $scope.projects.length; i++){
              if ($scope.projects[i]._id === projID) {
                $scope.projects.splice(i, 1);
                break;
              }
            }
          }
          else{
            $scope.message = results.data.message;
          }
        });
    }

    $scope.isLoggedIn = function() {
      return session.name() !== undefined;
    }

}])