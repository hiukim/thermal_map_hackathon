/**
 * @property center [lat, long]
 * @property altitude in Meter
 * @property heat Array of number
 */
Frame = {
  mapData: function() {
    var frame = this;
    var viewWidth = 2 * Math.tan(CAMERA_WIDTH_DEGREE) * frame.altitude;
    var viewHeight = 2 * Math.tan(CAMERA_HEIGHT_DEGREE) * frame.altitude;
    var widthPerPixel = viewWidth / RESO_WIDTH;
    var heightPerPixel = viewHeight / RESO_HEIGHT;

    var mapped = [];
    for (var index = 0; index < RESO_WIDTH * RESO_HEIGHT; index++) {
      var y = Math.floor(index / RESO_WIDTH);
      var x = index % RESO_WIDTH;
      var pixelFromCenterX = x - RESO_WIDTH / 2;
      var pixelFromCenterY = y - RESO_HEIGHT / 2;
      var metersFromCenterX = pixelFromCenterX * widthPerPixel;
      var metersFromCenterY = pixelFromCenterY * heightPerPixel;

      var lat = frame.center[0];
      var lon = frame.center[1];
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
  var center = [22.282464, 114.190497];
  var altitude = 200; // meter
  var heat = randomHeat(RESO_WIDTH, RESO_HEIGHT);

  return _.extend({}, Frame, {
    center: center,
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
