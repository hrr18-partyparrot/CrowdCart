angular.module('crowdcart.auth', [])// make an auth module


.controller('AuthController', function ($scope, $window, $location, Auth, $http) {
  $scope.user = {};

  $http({
    method: 'GET',
    url: '/api/signin'
  })
  .then(function({ data }) {
    if (data) {
      $window.localStorage.setItem('crowdcartuser', data.userid);
      $window.localStorage.setItem('crowdcartusername', data.name);
      $window.localStorage.setItem('crowdcartuserstreet', data.address.street);
      $window.localStorage.setItem('crowdcartusercity', data.address.city);
      $window.localStorage.setItem('crowdcartuserstate', data.address.state);
      $window.localStorage.setItem('crowdcartuserzip', data.address.zip_code);
      $location.path('/mylists');
    }
  }); 


  $scope.signin = function () {
    $scope.sending = "Sending Email.."
    Auth.signin($scope.email)
      .then(function (data) {
        $scope.sending = data;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function () {
        $location.path('/signin');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});