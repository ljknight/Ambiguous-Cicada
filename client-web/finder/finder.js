angular.module('kwiki.finder', ['services.socket', 'services.user', 'services.spinner'])

.controller('FinderController', ['$scope', '$state','$window', 'Socket', 'User', 'Spinner',
  function($scope, $state, $window, Socket, User, Spinner) {
    $scope.disableButton = false;

    $scope.address = '';

    $scope.submit = function() {
      // TODO: button gets stuck disabled
      $scope.disableButton = true;
      Socket.emit('joinRoom', {
        username: User.current(),
        address: $scope.address
      });
      $state.transitionTo('chat');
    };

    $scope.logOut = function() {
      User.logOut();
    };

    // Google Map & Places reference: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
    $window.initMap = function() {

      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));

      var mapOptions;
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var infowindow = new google.maps.InfoWindow();

      // Check for geolocation in order to center map
      if (!navigator.geolocation) {
        // If user doesn't have geolocation enabled, default to Hack Reactor 
        mapOptions = {
          center: {
            lat: 37.783542,
            lng: 122.408943
          },
          zoom: 13
        };
        // Async
        createMap();
      } else {
        // Geolocation reference: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {

            spinner.stop();

            console.log('found position:', position);

            Socket.emit('setPosition', {lat: position.coords.latitude, lng: position.coords.longitude});

            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            mapOptions = {
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              zoom: 13
            };
            // Async
            createMap();

            infowindow.setPosition(pos);
            infowindow.setContent('Location found.');
            $scope.map.setCenter(pos);
          }, function() {
            handleLocationError(true, infowindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infowindow, map.getCenter());
        }

        var handleLocationError = function(browserHasGeolocation, infowindow, pos) {
          infowindow.setPosition(pos);
          infowindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        };
      }

      var createMap = function() {
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var input = document.getElementById('place-input');

        var autocomplete = new google.maps.places.Autocomplete(input);
        // autocomplete.bindTo('bounds', map);

        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var marker = new google.maps.Marker({
          map: $scope.map,
        });

        marker.addListener('click', function() {
          infowindow.open($scope.map, marker);
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          //Invoke getPlace method and returns PlaceResult
          place = autocomplete.getPlace();
          //Store place_id
          $scope.address = place.place_id;
          // Call calcRoute once a place has been selected
          calcRoute();
          //If place has no location, return out of function
          if (!place.geometry) {
            return;
          }

          //If viewport exists, resize map bounds to viewport size
          //Else center map based on place's latitude/longitude
          if (place.geometry.viewport) {
            $scope.map.fitBounds(place.geometry.viewport);
          } else {
            $scope.map.setCenter(place.geometry.location);
            $scope.map.setZoom(17);
          }

          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });
          //Show marker
          marker.setVisible(true);

          // Set text displayed in infowindow
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address);
          infowindow.open($scope.map, marker);
        });
        directionsDisplay.setMap($scope.map);
        directionsDisplay.setPanel(document.getElementById("directions"));
      };

      // Directions reference: https://developers.google.com/maps/documentation/javascript/directions
      var calcRoute = function() {
        var start = new google.maps.LatLng(mapOptions.center.lat, mapOptions.center.lng);
        // End uses location object with lat(J), long(M) returned after user selects a place 
        var end = new google.maps.LatLng(place.geometry.location.J, place.geometry.location.M);

        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
        });
      };
    };

    // Load map here instead of inside script on index.html to get rid of console errors
    // $window.onload = function () { 
    //   initMap();
    // };

    // Loads map on state change
    $scope.$on('$stateChangeSuccess', function() {
      $window.initMap();
    });
  }
]);
