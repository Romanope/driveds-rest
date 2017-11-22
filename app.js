var express 	= require("express");
var app 		= express();
var bodyParser  = require('body-parser');
var path       	= require('path');
var routers     = require('./routers/arquivoRouters');
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

app.listen(3000, function () {
	console.log("server running in port 3000");
});