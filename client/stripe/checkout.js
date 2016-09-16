angular.module('crowdcart.checkout', [])// make an auth module

.controller('CheckoutController', function ($scope, $window, $location) {

  // $scope.signin = function () {
  //   Auth.signin($scope.user)
  //     .then(function (data) {
  //       console.log(data.address);
  //       //Save token, user_id and address to local storage
  //       $window.localStorage.setItem('crowdcarttoken', data.token)
  //       $window.localStorage.setItem('crowdcartuser', data.userid);
  //       $window.localStorage.setItem('crowdcartuserstreet', data.address.street);
  //       $window.localStorage.setItem('crowdcartusercity', data.address.city);
  //       $window.localStorage.setItem('crowdcartuserstate', data.address.state);
  //       $window.localStorage.setItem('crowdcartuserzip', data.address.zip_code);
  //       $location.path('/mylists');
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  // $scope.signup = function () {
  //   Auth.signup($scope.user)
  //     .then(function (data) {
  //       $window.localStorage.setItem('crowdcarttoken', data.token);
  //       // saving username to localstorage
  //       $window.localStorage.setItem('crowdcartuser', data.userid);
  //       $location.path('/mylists');
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };
});
