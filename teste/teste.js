var fs = require("fs");

walker = walk.walk("/tmp", options);
 
  walker.on("./teste", function (root, fileStats, next) {
    fs.readFile(fileStats.name, function () {
      next();
    });
  });

/*fs.stat('app.js', function (err, stats) {
  if (err) throw err;
  console.log('stats: ' + JSON.stringify(stats));
});*/