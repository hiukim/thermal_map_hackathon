START_LAT = 22.282464;
START_LNG = 114.190497;

var mainMap;
var heatMapLayers = {};
var heatMapLayer;

var handler;

var startSimulateStream = function() {
  handler = Meteor.setInterval(function() {
    render();
  }, 1000);
}

var stopSimulateStream = function() {
  Meteor.clearInterval(handler);
}

var renderWithFeed = function(feed) {
  _.extend(feed, Frame);
  renderMap(feed);
  renderCanvas(feed);
}

var renderMap = function(frame) {
  var key = frame.key;
  // clear previous
  if (heatMapLayers[key]) {
    heatMapLayers[key].setMap(null);
  }
  var mapped = frame.mapData();
  console.log("mapped: ", mapped);

  var issueData = [];
  for (var index = 0; index < frame.width * frame.height; index++) {
    if (mapped[index].heat > 125) {
      issueData.push({
        location: new google.maps.LatLng(mapped[index].lat, mapped[index].lng),
        weight: mapped[index].heat
      });
    }
  }
  console.log("issueData: ", issueData.length);
  var issueArray = new google.maps.MVCArray(issueData);
  heatMapLayers[key] = new google.maps.visualization.HeatmapLayer({
    data: issueArray,
    radius: 20
  });
  heatMapLayers[key].setMap(mainMap.instance);
}

var renderCanvas = function(frame) {
  var canvas = document.getElementById("canvas1");
  var context = canvas.getContext("2d");
  var imageData = context.createImageData(frame.width, frame.height);
  var heat = frame.heat;
  for (var i = 0; i < imageData.data.length; i+=4) {
    var pixelIndex = i;
    var value = heat[i / 4];
    imageData.data[pixelIndex] = value * 255;
    imageData.data[pixelIndex+1] = 0;
    imageData.data[pixelIndex+2] = 0;
    imageData.data[pixelIndex+3] = 255;
    if (value == 0) imageData.data[pixelIndex+3] = 0;
  }
  context.putImageData(imageData, 0, 0, 0, 0, frame.width, frame.height);
}

var render = function() {
  var frame = randomFrame();
  renderMap(frame);
  renderCanvas(frame);
}

Meteor.startup(function() {
  GoogleMaps.load({libraries: 'visualization'});
});

Template.body.onCreated(function() {
  var self = this;
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('mainMap', function(map) {
    mainMap = map;

    self.autorun(function() {
      Feed.find().observe({
        added(feed) {
          renderWithFeed(feed);
        },
        changed(feed) {
          renderWithFeed(feed);
        }
      });
    });
  });
});

Template.body.helpers({
  mainMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(START_LAT, START_LNG),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };
    }
  }
});

Template.body.events({
  "click #render-button": function() {
    render();
  },
  "click #start-button": function() {
    startSimulateStream();
  },
  "click #stop-button": function() {
    stopSimulateStream();
  }
});
