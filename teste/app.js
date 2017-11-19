var express 	= require("express");
var app 		= express();
var bodyParser  = require('body-parser');
var path       	= require('path');
var routers     = require('./routers/routers');
var usuarioRouters     = require('./routers/usuarioRouters');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	limit: '5mb',	
  	extended: true
}));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

app.use("/arquivos", routers);
app.use("/usuario", usuarioRouters);

var ffmetadata = require("ffmetadata");

var functions = {
	readFile: function (path) {
		ffmetadata.read(path, function(err, data) {
			
			if (err) console.error("Error reading metadata", err);
			else console.log(data);
		});
	}
}

functions.readFile("3840x2160-gaming.jpg");

/*app.listen(3000, function () {
	console.log("server running in port 3000");
});*/