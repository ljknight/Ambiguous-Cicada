exports.isMatch = function(itemA, itemB) {
  var distance = getDistance(itemA.coords, itemB.coords);
  return distance < Math.min(itemA.radius, itemB.radius);
};

var getDistance = function(coordsA, coordsB) {

  var R = 3958.7558657440545; // Radius of earth in Miles
  var toRad = function (degrees) {
    // Converts numeric degrees to radians
    return degrees * Math.PI / 180;
  };

  var dLat = toRad(coordsB.lat - coordsA.lat);
  var dLng = toRad(coordsB.lng - coordsA.lng);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(toRad(coordsA.lat)) * Math.cos(toRad(coordsB.lat)) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var dist = R * c;

  return dist;
};
