/**
 * Contains the definition of the main module, the configuration, and the
 * services used by the controllers.
 *
 * Authors: Michael Choi, George Du, Rujia Zha
 */

angular.module('teamMotivate', ['ui.router', 'ngCookies', 'ngTable'], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Converts an object to x-www-form-urlencoded serialization.
  // Credit: http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
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
.factory('session', ['$cookieStore', function($cookieStore) {
  return {
    name: function() {
      return $cookieStore.get('username');
    },
    setName: function(username) {
      $cookieStore.put('username', username);
    },
    clear: function() {
      $cookieStore.remove('username');
    }
  };
}])
.factory('users', ['$http', function($http) {
  var o = {
    users: []
  };

  o.get = function() {
    return $http.get('/users').success(function(data) {
      angular.copy(data, o.users);
    });
  };

  o.post = function(userData) {
  	return $http.post('/users', userData);
  }
  return o;
}])
.factory('projects', ['$http', function($http) {
  var o = {
    projects: []
  };

  o.getAll = function() {
    return $http.get('/projects').success(function(data) {
      angular.copy(data.projects, o.projects);
    });
  };

  o.get = function(id) {
    return $http.get('/projects/' + id);
  }

	o.post = function(projData) {
		return $http.post('/projects', projData);
	}

  o.update = function(id, projData) {
    return $http.post('/projects/' + id, projData);
  }

  o.delete = function(projID) {
    return $http.delete('/projects/'+projID);
  }
  return o;
}])
.factory('tasks', ['$http', function($http) {
  var o = {};

  o.getTasks = function(projID) {
    return $http.get('/projects/' + projID + '/tasks/');
  }

  o.addTask = function(projID, taskData) {
    return $http.post('/projects/' + projID + '/tasks', taskData);
  }

  o.put = function(taskData, projID, taskID) {
    return $http.put('/projects/' + projID + '/tasks/' + taskID, taskData);
  }

  o.get = function(projID, taskID) {
    return $http.get('/projects/' + projID + '/tasks/' + taskID);
  }

  o.delete = function(projID, taskID) {
    return $http.delete('/projects/' + projID + '/tasks/' + taskID);
  }
  return o;
}])
