angular.module('teamMotivate', ['ui.router'], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * Converts an object to x-www-form-urlencoded serialization.
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})
.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise('login');
}])
.factory('session', function() {
  return {};
})
.factory('users', ['$http', function($http) {

  var o = {
    users: []
  };
  
  o.get = function() {
  	console.log('in user get');
    return $http.get('/users').success(function(data) {
      angular.copy(data, o.users);
      console.log(o.users);
    });
  };

  o.post = function(userData) {
  	console.log('in user post');
  	console.log(userData);
  	return $http.post('/users', userData).success(function(data) {
  		console.log(data);
  		angular.copy(data, o.success);
  	});
  }
  return o;
}])
.factory('projects', ['$http', function($http) {
  var o = {
    projects: []
  };
  
  o.getAll = function() {
    return $http.get('/projects').success(function(data) {
  		console.log('in project get');
      angular.copy(data.projects, o.projects);
      console.log(o.projects);
    });
  };

	o.post = function(projData) {
		console.log('in project post');
		console.log(projData);
		return $http.post('/projects', projData).success(function(data) {
			console.log(data);
			angular.copy(data.projects, o.projects);
		});
	}
  return o;
}])
.factory('tasks', ['$http', function($http) {
  var o = {
    tasks: []
  };

  o.getTasks = function(projID) {
    return $http.get('/projects/' + projID + '/tasks/').success(function(data) {
      console.log('in task get');
      angular.copy(data.tasks, o.tasks);
      console.log(o.tasks);
    });
  }

  o.addTask = function(projID, taskData) {
    return $http.post('/projects/' + projID + '/tasks', taskData).success(function(data) {
      console.log(data);
    });
  }
  return o;
}])
