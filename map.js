
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
