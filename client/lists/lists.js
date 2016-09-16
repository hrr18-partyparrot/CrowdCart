angular.module("crowdcart.lists", ["angularMoment"])

.controller("ListsController", function ($scope, Lists, $window, $location, $rootScope, $routeParams, $http, $resource) {

  // storage objs
  $scope.data = {};
  $scope.list = {};
  $scope.list.delivery_address = {};
  $scope.list.items = [];

  // store userid into local storage (same level as auth token)
  $scope.userid = $window.localStorage.getItem('crowdcartuser');
  $scope.street = $window.localStorage.getItem('crowdcartuserstreet');
  $scope.state = $window.localStorage.getItem('crowdcartuserstate');
  $scope.city = $window.localStorage.getItem('crowdcartusercity');
  $scope.zip = $window.localStorage.getItem('crowdcartuserzip');

  var initialize = function () {

    // if routePararms exists it means listid is in URL
    if ($routeParams.listid) {
      // get list data and store on scope
      Lists.getOneList($routeParams.listid)
        .then(function (list) {
          $scope.displayList = list
        })
    }

    //Get all lists belong to user
    Lists.getLists($scope.userid)
      .then(function (lists) {
        $scope.data.lists = lists;
      })
      .catch(function (error) {
        console.error(error);
      });

    // Get all lists
    Lists.getAllList()
      .then(function(allLists){
        $scope.data.allLists = allLists.filter(function(list){
          //Only showing the list that has not deliverer, and those that do not belong to user, and not overdue
          return !list.deliverer_id && list.creator_id !== $scope.userid && new Date(list.due_at) >= new Date();
        });
      })
      .catch(function(error){
        console.error(error);
      });


  };


  //display list detail which uses list detail page
  $scope.displayDetail = function(listid) {
    // simple redirect passing over listid in URL
    $location.path("/listdetail/" + listid)
  }

  //add new list method, will be attached into createnewlist.html
  $scope.addList = function () {
    $scope.list.creator_id = $scope.userid;
    // Defaulting deliverer_id to empty string
    $scope.list.deliverer_id = '';

    //If user choose the default address, assign the default address to the list to be added
    if($scope.isDefaultAdd) {
      $scope.list.delivery_address = {
        street: $scope.street,
        city: $scope.city,
        state: $scope.state,
        zip_code: $scope.zip
      }
    }
    $scope.list.due_at.setHours($scope.list.due_hour);
    $scope.list.due_at.setMinutes($scope.list.due_minute);
    Lists.newList($scope.list)
      .then(function () {
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //searches Walmart's API
  $scope.searchItem = function() {
    var urlSearchProductApi = 'http://api.walmartlabs.com/v1/search';
    var keyApi = 'fahcgpfschk77ywg9ej8ukfy';
    console.log('attepmint to contact walmart');
    var searchRequest = $resource(urlSearchProductApi, {
        callback: "JSON_CALLBACK"
      },{
          get: {
            method: "JSONP"
          }
        });
    console.log('after first resource');
    searchRequest.get({apiKey: keyApi, query: $scope.itemSearch}, function(response) {
      console.log('callback walmart: ', response.items);
      $scope.walmartItems = response.items;
    });
  };

  // delete list
  $scope.deleteList = function(listid, idx) {
    Lists.deleteList(listid)
      .then(function () {
        $scope.data.lists.splice(idx, 1)
      })
  }


  //Add a job, update the deliverer id to user's id
  $scope.addJob = function(list) {

    list.deliverer_id = $scope.userid;

    // Update DB list with new deliverer_id
    Lists.updateList(list)
      .then(function () {
        console.log("add job", list)
        $location.path('/myjobs');
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  //Google Map initializer
  $scope.mapInitialize = function() {

    var locations = [];

    //Convert address objects into strings and save into locations

    $scope.data.allLists.forEach(function(item) {
      if(!item.delivery_address) {
        item.delivery_address = {};
      }
      locations.push(item.delivery_address.street + ' , ' + item.delivery_address.city + ' , ' + item.delivery_address.state + ' ' + item.delivery_address.zip_code)
    });

    //Geocoder for converting address string into coordicates
    //set up map object with some options
    var geocoder;
    var map;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);


    var myOptions = {
      zoom: 4,
      center: latlng,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


    //Method for converting address and make a marker on map
    var convertAdd = function (address, name) {
      if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
              content: '<p><b>'+ name + '</b></p><p><b>' + address + '</b></p>',
              size: new google.maps.Size(150, 50)
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: name
            });



            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });

          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
      }
    }


    //Iterate over the list of locations and apply converting address on each one
    for (var i = 0; i < locations.length; i++) {
      convertAdd(locations[i], $scope.data.allLists[i].name);
    }
}

  initialize();

  //Google map got initialize, set timeout to wait for the list data to be loaded
  google.maps.event.addDomListener(window, 'load', setTimeout($scope.mapInitialize, 500));
})


// Date Picker ui-bootstrap controller
.controller('DatepickerPopupDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    // remove disabled dates - prob could delete this entire section
    return mode === 'day' && (date.getDay() === 10 || date.getDay() === 10);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
});



