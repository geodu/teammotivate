/**
 * Authors: George Du, Michael Choi
 */

angular.module('teamMotivate')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('userlist', {
      url: '/users',
      templateUrl: '/app/userlist/userlist.html',
      controller: 'UsersCtrl',
      resolve: {
        postPromise: ['users', function(users) {
          return users.get();
        }]
      }
    });
}])

.controller('UsersCtrl', [
  '$http',
  '$scope',
  '$filter',
  'users',
  'ngTableParams',
  function($http, $scope, $filter, users, ngTableParams  ) {
    $scope.users = users.users;

    // Set up the table that allows sorting by field.
    // Credit: http://bazalt-cms.com/ng-table/example/3
    $scope.tableParams = new ngTableParams({
      page: 1,          // show first page
      count: 10,        // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
        total: $scope.users.length, // length of data
        getData: function($defer, params) {
          // use built-in angular filter
          var orderedData = params.sorting() ?
                            $filter('orderBy')($scope.users, params.orderBy()) :
                            $scope.users;
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
  }
])