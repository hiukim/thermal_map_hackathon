if (false && Meteor.isClient) {

  Meteor.startup(function() {
    GoogleMaps.load({libraries: 'visualization'});
  });

  Template.body.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('mainMap', function(map) {
      var frame = randomFrame();
      var mapped = frame.mapData();

      var issueData = [];
      for (var index = 0; index < RESO_WIDTH * RESO_HEIGHT; index++) {
        if (mapped[index][2] != 0) {
          issueData.push({
            location: new google.maps.LatLng(mapped[index][0], mapped[index][1]),
            weight: mapped[index][2]
          });
        }
      }
      console.log("issueData: ", issueData);

      var issueData3 = [
        {location: new google.maps.LatLng(22.281648600081127, 114.18961579695939), weight: 0.8}
      ]

      var issueData2 = [
        {location: new google.maps.LatLng(22.282632, 114.190121), weight: 0.8},
        {location: new google.maps.LatLng(22.282732, 114.190121), weight: 0.8},
        {location: new google.maps.LatLng(22.282832, 114.190121), weight: 0.8},
        {location: new google.maps.LatLng(22.282932, 114.190121), weight: 0.8},
        {location: new google.maps.LatLng(22.283032, 114.190821), weight: 10}
      ]
      var issueArray = new google.maps.MVCArray(issueData);
      var heatMapLayer = new google.maps.visualization.HeatmapLayer({
        data: issueArray,
        radius: 5
      });
      heatMapLayer.setMap(map.instance);

      var canvas = document.getElementById("canvas1");
      var context = canvas.getContext("2d");
      context.fillStyle = "black";
      context.fillRect(0, 0, 30, 30);
      console.log("canvas: ", canvas, context);
      var imageData = context.createImageData(RESO_WIDTH, RESO_HEIGHT);

      var heat = frame.heat;
      for (var i = 0; i < imageData.data.length; i+=4) {
        // var pixelIndex = 4960;
        var pixelIndex = i;
        var value = heat[i / 4];
        // imageData.data[pixelIndex] = 255;
        imageData.data[pixelIndex] = value * 255;
        imageData.data[pixelIndex+1] = 0;
        imageData.data[pixelIndex+2] = 0;
        imageData.data[pixelIndex+3] = 255;
        if (value == 0) imageData.data[pixelIndex+3] = 0;
      }
      context.putImageData(imageData, 0, 0, 0, 0, RESO_WIDTH, RESO_HEIGHT);
    });
  });

  Template.body.helpers({
    mainMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(22.282464, 114.190497),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        };
      }
    }
  });
}

var wRatio = 3.349 / 1000;
var hRatio = 3.349 / 1000;

var test2 = function() {
  var height = 200;
  var view_width = wRatio * height;
  var view_height = hRatio * height;
}

var test = function() {
  var height = 1.23; // 123 meter
  var sensor_width = 0.0254;
  var sensor_height = 3.2 * 0.0254;
  sensor_width = 4.546 / 1000;
  sensor_height = 3.416 / 1000;
  var focal = 30.4 / 1000;

  var view_width = sensor_width * height / focal;
  var view_height = sensor_height * height / focal;

  console.log("view = ", view_width, " x ", view_height);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
test();
    // var heat = randomHeatImage();
    // console.log("heat: ", heat);
    return;

    var BMP = Meteor.npmRequire('bmp-js');
    var PNG = Meteor.npmRequire('png-js');
    var fs = Meteor.require('fs')

    var filepath = process.env.PWD + '/private/1.png';

    PNG.decode(filepath, function(pixels) {
      console.log("pixels: ", pixels.length);
    });

    var buffer = fs.readFileSync(filepath);
    var bmpData = BMP.decode(buffer);
    console.log("buffer: ", bmpData);

    for (var i = 0; i < 10; i++) {
      var out = "";
      for (var j = 0; j < 10; j++) {
        var offset = bmpData.width * i + j;
        out += bmpData.data[offset] + " ";
      }
      console.log(out);
    }


    // console.log('bmp: ', BMP, fs);

    // code to run on server at startup
  });
}
