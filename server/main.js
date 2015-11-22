FIREBASE_URL = "https://flironedemo.firebaseio.com/";
// FIREBASE_SECRET = 'hPLl2FZCEtzWcow7DZNrvO1BiR2HcRHkLSAHPCOh';

var firebaseFeeds = [
  FIREBASE_URL + "feed1",
  FIREBASE_URL + "feed2",
  FIREBASE_URL + "feed3"
]

START_LATITUDE = 22.490336;
START_LONGITUDE = 114.183572;
START_ALTITUDE = 400; // meter
var simulateEvent = function() {
  var firebaseRef = new Firebase(firebaseFeeds[0]);
  Meteor.setInterval(function() {
    var frame = randomFrame();
    firebaseRef.set({
      width: frame.width,
      height: frame.height,
      latitude: START_LATITUDE,
      longitude: START_LONGITUDE,
      altitude: START_ALTITUDE,
      heat: frame.heat
    });
  }, 2000);
}

var observeEvent = function() {
  _.each(firebaseFeeds, function(feedURL) {
    var firebaseRef = new Firebase(feedURL);
    firebaseRef.on('value', Meteor.bindEnvironment(function(snapshot) {
      var val = snapshot.val();
      if (!val) return;
      var key = firebaseRef.toString();
      _.extend(val, {key: key});
      Feed.upsert({key: key}, {
        $set: val
      });
    }));
  });
}

Meteor.startup(function() {
  Feed.remove({});
  // simulateEvent();
  observeEvent();
});
