/**
 * @property latitude
 * @property longitude
 * @property altitude in meters
 * @property heat Array of number
 */
Frame = {
  mapData: function() {
    var frame = this;
    var viewWidth = 2 * Math.tan(CAMERA_WIDTH_DEGREE) * frame.altitude;
    var viewHeight = 2 * Math.tan(CAMERA_HEIGHT_DEGREE) * frame.altitude;
    var widthPerPixel = viewWidth / this.width;
    var heightPerPixel = viewHeight / this.height;

    var mapped = [];
    for (var index = 0; index < this.width * this.height; index++) {
      var y = Math.floor(index / this.width);
      var x = index % this.width;
      var pixelFromCenterX = x - this.width / 2;
      var pixelFromCenterY = y - this.height / 2;
      var metersFromCenterX = pixelFromCenterX * widthPerPixel;
      var metersFromCenterY = pixelFromCenterY * heightPerPixel;

      var lat = frame.latitude;
      var lon = frame.longitude;
      var dy = -1 * metersFromCenterY;
      var dx = metersFromCenterX;
      var r_earth = 6378137;
      var pi = Math.PI;
      var newLat  = lat  + (dy / r_earth) * (180 / pi);
      var newLon = lon + (dx / r_earth) * (180 / pi) / Math.cos(lat * pi/180);

      // mapped.push([newLat, newLon, frame.heat[index]]);
      mapped.push({
        lat: newLat,
        lng: newLon,
        heat: frame.heat[index]
      });
    }
    return mapped;
  }
}

randomFrame = function() {
  var width = RESO_WIDTH / 4;
  var height = RESO_HEIGHT / 4;
  var latitude = 22.282464;
  var longitude = 114.190497;
  var altitude = 400; // meter
  var heat = randomHeat(width, height);

  return _.extend({}, Frame, {
    width: width,
    height: height,
    latitude: latitude,
    longitude: longitude,
    altitude: altitude,
    heat: heat
  });
}

var randomHeat = function(width, height) {
  var heat = [];
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {

      // construct a sparse matrix
      if (Random.fraction() < 0.99) {
        heat.push(0);
        continue;
      }
      var value = Random.fraction();
      heat.push(value);
    }
  }
  return heat;
}
