angular.module('teamMotivate', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/views/home.html',
      controller: 'MainCtrl',
      resolve: {
		  postPromise: ['projects', function(projects){
		    return projects.getAll();
		  }]
}
    })
    .state('projects', {
		  url: '/projects/{id}',
		  templateUrl: '/views/projects.html',
		  controller: 'ProjectsCtrl'
		});

  $urlRouterProvider.otherwise('home');
}])
.factory('projects', ['$http',function($http){
  var o = {
    projects: []
  };
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  var data = {
  	username: 'dchoi2',
  	password: 'asdfasdf'
  }
  console.log(data);
  $http.post('/sessions', data).error(function(message, status, headers, config) {
    console.log(message);
    console.log(status);
    console.log(headers);
    console.log(config);
  });
  // .success(function(response) {
  // 	console.log(response);
  // })
  o.getAll = function() {
    return $http.get('/projects').success(function(data){
      angular.copy(data, o.projects);
    });
  };
  return o;
}])
.controller('MainCtrl', [
	'$scope',
	'projects',
	function($scope, projects){
	console.log(projects);
	$scope.projects = projects.projects;
	$scope.projects.push({
	  title: $scope.title,
	  link: $scope.link,
	  upvotes: 0,
	  comments: [
	    {author: 'Joe', body: 'Cool post!', upvotes: 0},
	    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
	  ]
	});
	$scope.projects = [
	  {title: 'post 1', upvotes: 5},
	  {title: 'post 2', upvotes: 2},
	  {title: 'post 3', upvotes: 15},
	  {title: 'post 4', upvotes: 9},
	  {title: 'post 5', upvotes: 4}
	];

	$scope.addPost = function(){
		if($scope.title === '') { return; }
		$scope.projects.push({title: $scope.title, upvotes: 0});
	  $scope.title = '';
	};

	$scope.incrementUpvotes = function(post) {
	  post.upvotes += 1;
	};

	$scope.addPost = function(){
	  if($scope.title === '') { return; }
	  $scope.projects.push({
	    title: $scope.title,
	    link: $scope.link,
	    upvotes: 0
	  });
	  $scope.title = '';
	  $scope.link = '';
	};
}])
.controller('ProjectsCtrl', [
	'$scope',
	'$stateParams',
	'projects',
	function($scope, $stateParams, projects){
		console.log(projects);
		console.log($stateParams);
		$scope.post = projects.projects[$stateParams.id];
		console.log(projects.projects);
		console.log($scope);
		$scope.addComment = function(){
		  if($scope.body === '') { return; }
		  $scope.post.comments.push({
		    body: $scope.body,
		    author: 'user',
		    upvotes: 0
		  });
		  $scope.body = '';
		};
}]);
