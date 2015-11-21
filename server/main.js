FIREBASE_URL = "https://flironedemo.firebaseio.com/";
FIREBASE_SECRET = 'hPLl2FZCEtzWcow7DZNrvO1BiR2HcRHkLSAHPCOh';

var firebaseFeeds = [
  FIREBASE_URL + "feed1",
  FIREBASE_URL + "feed2",
  FIREBASE_URL + "feed3"
]

var firebaseRef;

var connectFirebase = function(callback) {
  firebaseRef = new Firebase(FIREBASE_URL);
  callback();
  /*
  firebaseRef.auth(FIREBASE_SECRET, Meteor.bindEnvironment(function(error, result) {
    console.info('Authenticated successfully with payload:', result.auth);
    console.info('Auth expires at:', new Date(result.expires * 1000));
    callback();
  }));
  */
}

START_LATITUDE = 22.282464;
START_LONGITUDE = 114.190497;
START_ALTITUDE = 400; // meter
var simulateEvent = function() {
  var firebaseRef = new Firebase(firebaseFeeds[0]);
  Meteor.setInterval(function() {
    var frame = randomFrame();
    firebaseRef.set({
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
  connectFirebase(function() {
    simulateEvent();
    observeEvent();
  });
});
