var fs = require("fs");
var walk = require("walk");

walker = walk.walk("./teste");
 
  walker.on("file", function (root, fileStats, next) {
    
	fs.readFile(fileStats.name, function () {
      console.log(fileStats);
	  next();
    });
  });

/*fs.stat('app.js', function (err, stats) {
  if (err) throw err;
  console.log('stats: ' + JSON.stringify(stats));
});*/