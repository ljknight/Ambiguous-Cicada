angular.module('kwiki.map', [])

.controller('MapController', ['$scope', 'Socket', function($scope) {
  $scope.place_id = '';

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.7833, lng: 122.4167},
      zoom: 13
    });

    var input = $scope.place;

    var autocomplete = new google.maps.places.Autocomplete(input);
    // autocomplete.bindTo('bounds', map);

    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      //Invoke getPlace method and returns PlaceResult
      var place = autocomplete.getPlace();
      //Store place_id
      $scope.place_id = place.place_id;
      //If place has no location, return out of function
      if (!place.geometry) {
        return;
      }

      //If viewport exists, resize map bounds to viewport size
      //Else center map based on place's latitude/longitude
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Set the position of the marker using the place ID and location.
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
      });
      //Show marker
      marker.setVisible(true);

      //Set text displayed in infowindow
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        place.formatted_address/*+ '<br>' + '<img src="' + place.photos[0].getUrl({"maxWidth": 50}) + '" />'*/);
      infowindow.open(map, marker);
    });
  }

}]);



