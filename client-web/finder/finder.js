angular.module('kwiki.finder', ['services.socket', 'services.user'])

.controller('FinderController', ['$scope', '$state', '$window', 'Socket', 'User',
  function($scope, $state, $window, Socket, User) {
    $scope.disableButton = false;

    $scope.address = '';

    $scope.submit = function() {
      // TODO: button gets stuck disabled
      $scope.disableButton = true;
      Socket.emit('joinRoom', {
        username: User.current(),
        address: $scope.address
      });
      // TODO: state transition
      $state.transitionTo('chat');
    };

    $scope.logOut = function() {
      User.logOut();
    };

    // Reference: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
    $window.initMap = function() {
      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 37.783542,
          lng: -122.408943
        },
        zoom: 13
      });

      var input = document.getElementById('place-input');

      var autocomplete = new google.maps.places.Autocomplete(input);
      // autocomplete.bindTo('bounds', map);

      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: $scope.map,
      });

      marker.addListener('click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>');
        infowindow.open($scope.map, marker);
      });

      autocomplete.addListener('place_changed', function() {
        infowindow.close();
        //Invoke getPlace method and returns PlaceResult
        place = autocomplete.getPlace();
        //Store place_id
        $scope.address = place.place_id;
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

        //Set text displayed in infowindow
          // $scope.place.formatted_address + '<br>' + '" />' );
        // infowindow.open($scope.map, marker);
      });
    };
  }
]);
